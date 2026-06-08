# L. Glow — ColdFusion / MSSQL Backend Reference

Complete implementation reference for the ColdFusion 2018 + MSSQL backend option.
Compare against `docs/backend-supabase.md` (TBD) when making the final infrastructure decision.

**Stack:** ColdFusion 2018, MSSQL (existing panda-mobile server), Firebase Auth (JWT verification only)
**Pattern:** Older URL-param CFC style — `.cfc?method=methodName&token=<jwt>&param=value`
**Auth:** Firebase ID token passed as `token` URL/form param on every request

---

## File structure

```
lglow/
  FirebaseAuth.cfc      — JWT verification + user upsert
  lglowBase.cfc         — shared authenticate(), errorResponse()
  users.cfc
  dosha.cfc
  checkins.cfc
  journal.cfc
  intentions.cfc
  practices.cfc
  practitioner.cfc
  sync.cfc
```

---

## Database schema

See `docs/roadmap.md` item #31 for the full `CREATE TABLE` statements.
Tables live in the `lglow` schema on the existing MSSQL server.

---

## FirebaseAuth.cfc

Handles Firebase JWT verification via Java crypto (CF2018's built-in
`jwtDecode()` only supports HMAC — Firebase uses RS256, so Java crypto is required).
Caches Google's public keys in application scope for 60 minutes.

```coldfusion
<cfcomponent output="false" displayname="FirebaseAuth">

    <cfset variables.projectId   = "your-lglow-firebase-project-id" />
    <cfset variables.issuer      = "https://securetoken.google.com/#variables.projectId#" />
    <cfset variables.keysUrl     = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com" />
    <cfset variables.cacheKey    = "lglow_firebase_public_keys" />
    <cfset variables.cacheTTLMin = 60 />

    <cffunction name="verifyToken" access="public" returntype="struct" output="false">
        <cfargument name="idToken" type="string" required="true" />

        <cfset var parts = listToArray(arguments.idToken, ".") />
        <cfif arrayLen(parts) neq 3>
            <cfthrow message="Invalid JWT: expected 3 parts" />
        </cfif>

        <cfset var header  = deserializeJson(base64UrlDecodeToString(parts[1])) />
        <cfset var payload = deserializeJson(base64UrlDecodeToString(parts[2])) />

        <cfif not structKeyExists(header, "alg") or header.alg neq "RS256">
            <cfthrow message="Invalid JWT: expected RS256" />
        </cfif>
        <cfif not structKeyExists(header, "kid")>
            <cfthrow message="Invalid JWT: missing kid" />
        </cfif>

        <cfset var nowEpoch = int(getTickCount() / 1000) />

        <cfif not structKeyExists(payload, "exp") or payload.exp lt nowEpoch>
            <cfthrow message="Token expired" />
        </cfif>
        <cfif not structKeyExists(payload, "iat") or payload.iat gt nowEpoch + 5>
            <cfthrow message="Token issued in the future" />
        </cfif>
        <cfif not structKeyExists(payload, "iss") or payload.iss neq variables.issuer>
            <cfthrow message="Invalid issuer" />
        </cfif>
        <cfif not structKeyExists(payload, "aud") or payload.aud neq variables.projectId>
            <cfthrow message="Invalid audience" />
        </cfif>
        <cfif not structKeyExists(payload, "sub") or len(trim(payload.sub)) eq 0>
            <cfthrow message="Invalid subject (uid)" />
        </cfif>

        <cfset var publicKeys = getPublicKeys() />
        <cfif not structKeyExists(publicKeys, header.kid)>
            <cfset publicKeys = fetchAndCacheKeys() />
            <cfif not structKeyExists(publicKeys, header.kid)>
                <cfthrow message="Unknown key ID: #header.kid#" />
            </cfif>
        </cfif>

        <cfset verifyRsaSignature(parts[1] & "." & parts[2], parts[3], publicKeys[header.kid]) />

        <cfreturn payload />
    </cffunction>

    <cffunction name="resolveUser" access="public" returntype="struct" output="false">
        <cfargument name="claims"      type="struct" required="true" />
        <cfargument name="datasource"  type="string" required="true" />

        <cfset var firebaseUid = arguments.claims.sub />
        <cfset var email       = structKeyExists(arguments.claims, "email") ? arguments.claims.email : "" />
        <cfset var displayName = structKeyExists(arguments.claims, "name")  ? arguments.claims.name  : "" />

        <cfquery name="local.q" datasource="#arguments.datasource#">
            MERGE lglow.Users AS target
            USING (SELECT
                <cfqueryparam value="#firebaseUid#" cfsqltype="cf_sql_nvarchar"> AS firebase_uid,
                <cfqueryparam value="#email#"       cfsqltype="cf_sql_nvarchar"> AS email,
                <cfqueryparam value="#displayName#" cfsqltype="cf_sql_nvarchar"> AS display_name
            ) AS source ON target.firebase_uid = source.firebase_uid
            WHEN NOT MATCHED THEN
                INSERT (firebase_uid, email, display_name)
                VALUES (source.firebase_uid, source.email, source.display_name)
            WHEN MATCHED AND (
                target.email        <> source.email OR
                target.display_name <> source.display_name
            ) THEN
                UPDATE SET
                    email        = source.email,
                    display_name = source.display_name,
                    updated_at   = GETUTCDATE()
            OUTPUT INSERTED.user_id, INSERTED.firebase_uid, INSERTED.role;
        </cfquery>

        <cfreturn {
            userId:      local.q.user_id,
            firebaseUid: local.q.firebase_uid,
            role:        local.q.role
        } />
    </cffunction>

    <!--- Private helpers --->

    <cffunction name="getPublicKeys" access="private" returntype="struct" output="false">
        <cfif structKeyExists(application, variables.cacheKey)
              and isDate(application[variables.cacheKey].expiresAt)
              and application[variables.cacheKey].expiresAt gt now()>
            <cfreturn application[variables.cacheKey].keys />
        </cfif>
        <cfreturn fetchAndCacheKeys() />
    </cffunction>

    <cffunction name="fetchAndCacheKeys" access="private" returntype="struct" output="false">
        <cfhttp url="#variables.keysUrl#" method="get" result="local.httpResult" />
        <cfif local.httpResult.statusCode neq "200 OK">
            <cfthrow message="Failed to fetch Firebase public keys: #local.httpResult.statusCode#" />
        </cfif>
        <cfset var keys = deserializeJson(local.httpResult.fileContent) />
        <cflock scope="application" type="exclusive" timeout="5">
            <cfset application[variables.cacheKey] = {
                keys:      keys,
                expiresAt: dateAdd("n", variables.cacheTTLMin, now())
            } />
        </cflock>
        <cfreturn keys />
    </cffunction>

    <cffunction name="base64UrlDecodeToString" access="private" returntype="string" output="false">
        <cfargument name="input" type="string" required="true" />
        <cfset var b64 = replace(replace(arguments.input, "-", "+", "all"), "_", "/", "all") />
        <cfswitch expression="#len(b64) mod 4#">
            <cfcase value="2"><cfset b64 &= "==" /></cfcase>
            <cfcase value="3"><cfset b64 &= "="  /></cfcase>
        </cfswitch>
        <cfreturn toString(toBinary(b64)) />
    </cffunction>

    <cffunction name="base64UrlDecodeToBytes" access="private" returntype="any" output="false">
        <cfargument name="input" type="string" required="true" />
        <cfset var b64 = replace(replace(arguments.input, "-", "+", "all"), "_", "/", "all") />
        <cfswitch expression="#len(b64) mod 4#">
            <cfcase value="2"><cfset b64 &= "==" /></cfcase>
            <cfcase value="3"><cfset b64 &= "="  /></cfcase>
        </cfswitch>
        <cfreturn toBinary(b64) />
    </cffunction>

    <cffunction name="verifyRsaSignature" access="private" returntype="void" output="false">
        <cfargument name="signingInput" type="string" required="true" />
        <cfargument name="signature"    type="string" required="true" />
        <cfargument name="pemCert"      type="string" required="true" />

        <cfset var certFactory = createObject("java", "java.security.cert.CertificateFactory").getInstance("X.509") />
        <cfset var bais        = createObject("java", "java.io.ByteArrayInputStream").init(charsetDecode(arguments.pemCert, "utf-8")) />
        <cfset var publicKey   = certFactory.generateCertificate(bais).getPublicKey() />

        <cfset var sig = createObject("java", "java.security.Signature").getInstance("SHA256withRSA") />
        <cfset sig.initVerify(publicKey) />
        <cfset sig.update(charsetDecode(arguments.signingInput, "utf-8")) />

        <cfif not sig.verify(base64UrlDecodeToBytes(arguments.signature))>
            <cfthrow message="JWT signature verification failed" />
        </cfif>
    </cffunction>

</cfcomponent>
```

---

## lglowBase.cfc

```coldfusion
<cfcomponent output="false">

    <cfset variables.datasource = "your_mssql_datasource" />
    <cfset variables.auth       = createObject("component", "lglow.FirebaseAuth") />

    <cffunction name="authenticate" access="private" returntype="struct" output="false">
        <cfset var idToken = "" />

        <cfif structKeyExists(url, "token") and len(trim(url.token))>
            <cfset idToken = trim(url.token) />
        <cfelseif structKeyExists(form, "token") and len(trim(form.token))>
            <cfset idToken = trim(form.token) />
        <cfelse>
            <cfset var headers    = getHttpRequestData().headers />
            <cfset var authHeader = structKeyExists(headers, "Authorization") ? headers["Authorization"] : "" />
            <cfif len(trim(authHeader)) and compareNoCase(left(authHeader, 7), "Bearer ") eq 0>
                <cfset idToken = trim(mid(authHeader, 8, len(authHeader))) />
            </cfif>
        </cfif>

        <cfif not len(idToken)>
            <cfthrow message="Missing token" errorcode="401" />
        </cfif>

        <cftry>
            <cfset var claims = variables.auth.verifyToken(idToken) />
            <cfreturn variables.auth.resolveUser(claims, variables.datasource) />
            <cfcatch type="any">
                <cfthrow message="Unauthorized: #cfcatch.message#" errorcode="401" />
            </cfcatch>
        </cftry>
    </cffunction>

    <cffunction name="requirePractitioner" access="private" returntype="struct" output="false">
        <cfset var user = authenticate() />
        <cfif user.role neq "practitioner">
            <cfthrow message="Forbidden" errorcode="403" />
        </cfif>
        <cfreturn user />
    </cffunction>

    <cffunction name="errorResponse" access="private" returntype="struct" output="false">
        <cfargument name="message" type="string"  required="true" />
        <cfargument name="code"    type="numeric" required="false" default="500" />
        <cfreturn { success: false, errorCode: arguments.code, message: arguments.message } />
    </cffunction>

    <!--- Convert a cfquery result to an array of structs --->
    <cffunction name="queryToArray" access="private" returntype="array" output="false">
        <cfargument name="q" type="query" required="true" />
        <cfset var result = [] />
        <cfset var cols   = listToArray(arguments.q.columnList) />
        <cfloop query="arguments.q">
            <cfset var row = {} />
            <cfloop array="#cols#" item="local.col">
                <cfset row[local.col] = arguments.q[local.col][arguments.q.currentRow] />
            </cfloop>
            <cfset arrayAppend(result, row) />
        </cfloop>
        <cfreturn result />
    </cffunction>

</cfcomponent>
```

---

## users.cfc

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        getMe
        users.cfc?method=getMe&token=...
    --->
    <cffunction name="getMe" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT user_id, firebase_uid, email, display_name,
                       role, theme_preference, created_at
                FROM   lglow.Users
                WHERE  user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfreturn {
                success:         true,
                userId:          local.q.user_id,
                firebaseUid:     local.q.firebase_uid,
                email:           local.q.email,
                displayName:     local.q.display_name,
                role:            local.q.role,
                themePreference: local.q.theme_preference,
                createdAt:       local.q.created_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        updateMe
        users.cfc?method=updateMe&token=...&displayName=Lindsey&themePreference=cream
    --->
    <cffunction name="updateMe" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user         = authenticate() />
            <cfset var displayName  = structKeyExists(url, "displayName")  ? url.displayName  : "" />
            <cfset var themePref    = structKeyExists(url, "themePreference") ? url.themePreference : "" />

            <cfquery datasource="#variables.datasource#">
                UPDATE lglow.Users
                SET
                    display_name     = CASE WHEN <cfqueryparam value="#len(displayName) gt 0#" cfsqltype="cf_sql_bit"> = 1
                                           THEN <cfqueryparam value="#displayName#" cfsqltype="cf_sql_nvarchar">
                                           ELSE display_name END,
                    theme_preference = CASE WHEN <cfqueryparam value="#len(themePref) gt 0#" cfsqltype="cf_sql_bit"> = 1
                                           THEN <cfqueryparam value="#themePref#" cfsqltype="cf_sql_nvarchar">
                                           ELSE theme_preference END,
                    updated_at       = GETUTCDATE()
                WHERE user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfreturn { success: true } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## dosha.cfc

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        saveDoshaResult
        dosha.cfc?method=saveDoshaResult&token=...&vataScore=5&pittaScore=2&kaphaScore=1
    --->
    <cffunction name="saveDoshaResult" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user        = authenticate() />
            <cfset var vataScore   = val(url.vataScore)  />
            <cfset var pittaScore  = val(url.pittaScore) />
            <cfset var kaphaScore  = val(url.kaphaScore) />

            <!--- Derive primary dosha --->
            <cfset var scores = { vata: vataScore, pitta: pittaScore, kapha: kaphaScore } />
            <cfset var primary = "vata" />
            <cfif pittaScore gte vataScore and pittaScore gte kaphaScore>
                <cfset primary = "pitta" />
            <cfelseif kaphaScore gte vataScore and kaphaScore gte pittaScore>
                <cfset primary = "kapha" />
            </cfif>

            <!--- Mark all previous results as not current --->
            <cfquery datasource="#variables.datasource#">
                UPDATE lglow.DoshaResults
                SET    is_current = 0
                WHERE  user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Insert new result --->
            <cfquery name="local.q" datasource="#variables.datasource#">
                INSERT INTO lglow.DoshaResults
                    (user_id, primary_dosha, vata_score, pitta_score, kapha_score, is_current)
                OUTPUT
                    INSERTED.result_id, INSERTED.primary_dosha,
                    INSERTED.vata_score, INSERTED.pitta_score, INSERTED.kapha_score,
                    INSERTED.is_current, INSERTED.taken_at
                VALUES (
                    <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">,
                    <cfqueryparam value="#primary#"     cfsqltype="cf_sql_nvarchar">,
                    <cfqueryparam value="#vataScore#"   cfsqltype="cf_sql_tinyint">,
                    <cfqueryparam value="#pittaScore#"  cfsqltype="cf_sql_tinyint">,
                    <cfqueryparam value="#kaphaScore#"  cfsqltype="cf_sql_tinyint">,
                    1
                )
            </cfquery>

            <cfreturn {
                success:      true,
                resultId:     local.q.result_id,
                primaryDosha: local.q.primary_dosha,
                vataScore:    local.q.vata_score,
                pittaScore:   local.q.pitta_score,
                kaphaScore:   local.q.kapha_score,
                takenAt:      local.q.taken_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getCurrentDosha
        dosha.cfc?method=getCurrentDosha&token=...
    --->
    <cffunction name="getCurrentDosha" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT TOP 1
                    result_id, primary_dosha, vata_score,
                    pitta_score, kapha_score, taken_at
                FROM lglow.DoshaResults
                WHERE user_id   = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
                  AND is_current = 1
                ORDER BY taken_at DESC
            </cfquery>

            <cfif local.q.recordCount eq 0>
                <cfreturn { success: true, result: javaCast("null", "") } />
            </cfif>

            <cfreturn {
                success:      true,
                resultId:     local.q.result_id,
                primaryDosha: local.q.primary_dosha,
                vataScore:    local.q.vata_score,
                pittaScore:   local.q.pitta_score,
                kaphaScore:   local.q.kapha_score,
                takenAt:      local.q.taken_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getDoshaHistory
        dosha.cfc?method=getDoshaHistory&token=...
    --->
    <cffunction name="getDoshaHistory" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT result_id, primary_dosha, vata_score,
                       pitta_score, kapha_score, is_current, taken_at
                FROM   lglow.DoshaResults
                WHERE  user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
                ORDER BY taken_at DESC
            </cfquery>

            <cfreturn { success: true, results: queryToArray(local.q) } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## journal.cfc

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        saveJournalEntry
        journal.cfc?method=saveJournalEntry&token=...&entryDate=2026-06-04
                   &gratefulText=...&showedText=...&tomorrowText=...
        All text params optional — partial saves are valid.
    --->
    <cffunction name="saveJournalEntry" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user         = authenticate() />
            <cfset var entryDate    = url.entryDate />
            <cfset var grateful     = structKeyExists(url, "gratefulText")  ? url.gratefulText  : javaCast("null","") />
            <cfset var showed       = structKeyExists(url, "showedText")    ? url.showedText    : javaCast("null","") />
            <cfset var tomorrow     = structKeyExists(url, "tomorrowText")  ? url.tomorrowText  : javaCast("null","") />

            <cfquery name="local.q" datasource="#variables.datasource#">
                MERGE lglow.JournalEntries AS target
                USING (SELECT
                    <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer"> AS user_id,
                    <cfqueryparam value="#entryDate#"   cfsqltype="cf_sql_date">    AS entry_date
                ) AS source
                ON  target.user_id   = source.user_id
                AND target.entry_date = source.entry_date
                WHEN NOT MATCHED THEN
                    INSERT (user_id, entry_date, grateful_text, showed_text, tomorrow_text)
                    VALUES (source.user_id, source.entry_date,
                        <cfqueryparam value="#grateful#"  cfsqltype="cf_sql_nvarchar" null="#isNull(grateful)#">,
                        <cfqueryparam value="#showed#"    cfsqltype="cf_sql_nvarchar" null="#isNull(showed)#">,
                        <cfqueryparam value="#tomorrow#"  cfsqltype="cf_sql_nvarchar" null="#isNull(tomorrow)#">)
                WHEN MATCHED THEN
                    UPDATE SET
                        grateful_text = COALESCE(<cfqueryparam value="#grateful#"  cfsqltype="cf_sql_nvarchar" null="#isNull(grateful)#">,  target.grateful_text),
                        showed_text   = COALESCE(<cfqueryparam value="#showed#"    cfsqltype="cf_sql_nvarchar" null="#isNull(showed)#">,    target.showed_text),
                        tomorrow_text = COALESCE(<cfqueryparam value="#tomorrow#"  cfsqltype="cf_sql_nvarchar" null="#isNull(tomorrow)#">,  target.tomorrow_text),
                        updated_at    = GETUTCDATE()
                OUTPUT
                    INSERTED.entry_id, INSERTED.entry_date,
                    INSERTED.grateful_text, INSERTED.showed_text,
                    INSERTED.tomorrow_text, INSERTED.updated_at;
            </cfquery>

            <cfreturn {
                success:      true,
                entryId:      local.q.entry_id,
                entryDate:    local.q.entry_date,
                gratefulText: local.q.grateful_text,
                showedText:   local.q.showed_text,
                tomorrowText: local.q.tomorrow_text,
                updatedAt:    local.q.updated_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getJournalEntry
        journal.cfc?method=getJournalEntry&token=...&entryDate=2026-06-04
    --->
    <cffunction name="getJournalEntry" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT entry_id, entry_date, grateful_text,
                       showed_text, tomorrow_text, created_at, updated_at
                FROM   lglow.JournalEntries
                WHERE  user_id   = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
                  AND  entry_date = <cfqueryparam value="#url.entryDate#" cfsqltype="cf_sql_date">
            </cfquery>

            <cfif local.q.recordCount eq 0>
                <cfreturn { success: true, entry: javaCast("null","") } />
            </cfif>

            <cfreturn {
                success:      true,
                entryId:      local.q.entry_id,
                entryDate:    local.q.entry_date,
                gratefulText: local.q.grateful_text,
                showedText:   local.q.showed_text,
                tomorrowText: local.q.tomorrow_text,
                createdAt:    local.q.created_at,
                updatedAt:    local.q.updated_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getJournalList
        journal.cfc?method=getJournalList&token=...&limit=20&offset=0
    --->
    <cffunction name="getJournalList" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user   = authenticate() />
            <cfset var lim    = structKeyExists(url,"limit")  ? min(val(url.limit),  100) : 20 />
            <cfset var offset = structKeyExists(url,"offset") ? max(val(url.offset), 0)   : 0  />

            <cfquery name="local.total" datasource="#variables.datasource#">
                SELECT COUNT(*) AS cnt
                FROM   lglow.JournalEntries
                WHERE  user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT entry_id, entry_date,
                       LEFT(grateful_text,  100) AS grateful_excerpt,
                       LEFT(showed_text,    100) AS showed_excerpt,
                       LEFT(tomorrow_text,  100) AS tomorrow_excerpt
                FROM   lglow.JournalEntries
                WHERE  user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
                ORDER BY entry_date DESC
                OFFSET <cfqueryparam value="#offset#" cfsqltype="cf_sql_integer"> ROWS
                FETCH  NEXT <cfqueryparam value="#lim#" cfsqltype="cf_sql_integer"> ROWS ONLY
            </cfquery>

            <cfreturn {
                success: true,
                total:   local.total.cnt,
                entries: queryToArray(local.q)
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## intentions.cfc

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        saveIntention
        intentions.cfc?method=saveIntention&token=...
                      &intentionDate=2026-06-04&intentionText=rest+more
    --->
    <cffunction name="saveIntention" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user          = authenticate() />
            <cfset var intentionDate = url.intentionDate />
            <cfset var intentionText = url.intentionText />

            <cfquery name="local.q" datasource="#variables.datasource#">
                MERGE lglow.Intentions AS target
                USING (SELECT
                    <cfqueryparam value="#user.userId#"     cfsqltype="cf_sql_integer"> AS user_id,
                    <cfqueryparam value="#intentionDate#"   cfsqltype="cf_sql_date">    AS intention_date
                ) AS source
                ON  target.user_id       = source.user_id
                AND target.intention_date = source.intention_date
                WHEN NOT MATCHED THEN
                    INSERT (user_id, intention_date, intention_text)
                    VALUES (source.user_id, source.intention_date,
                        <cfqueryparam value="#intentionText#" cfsqltype="cf_sql_nvarchar">)
                WHEN MATCHED THEN
                    UPDATE SET intention_text = <cfqueryparam value="#intentionText#" cfsqltype="cf_sql_nvarchar">
                OUTPUT
                    INSERTED.intention_id, INSERTED.intention_date,
                    INSERTED.intention_text, INSERTED.created_at;
            </cfquery>

            <cfreturn {
                success:       true,
                intentionId:   local.q.intention_id,
                intentionDate: local.q.intention_date,
                intentionText: local.q.intention_text,
                createdAt:     local.q.created_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getIntention
        intentions.cfc?method=getIntention&token=...&intentionDate=2026-06-04
    --->
    <cffunction name="getIntention" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT intention_id, intention_date, intention_text, created_at
                FROM   lglow.Intentions
                WHERE  user_id        = <cfqueryparam value="#user.userId#"       cfsqltype="cf_sql_integer">
                  AND  intention_date = <cfqueryparam value="#url.intentionDate#" cfsqltype="cf_sql_date">
            </cfquery>

            <cfif local.q.recordCount eq 0>
                <cfreturn { success: true, intention: javaCast("null","") } />
            </cfif>

            <cfreturn {
                success:       true,
                intentionId:   local.q.intention_id,
                intentionDate: local.q.intention_date,
                intentionText: local.q.intention_text,
                createdAt:     local.q.created_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## practices.cfc

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        completePractice
        practices.cfc?method=completePractice&token=...
                     &practiceDate=2026-06-04&practiceKey=morning
    --->
    <cffunction name="completePractice" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user         = authenticate() />
            <cfset var practiceDate = url.practiceDate />
            <cfset var practiceKey  = url.practiceKey />

            <cfquery name="local.q" datasource="#variables.datasource#">
                MERGE lglow.PracticeCompletions AS target
                USING (SELECT
                    <cfqueryparam value="#user.userId#"    cfsqltype="cf_sql_integer">  AS user_id,
                    <cfqueryparam value="#practiceDate#"   cfsqltype="cf_sql_date">     AS practice_date,
                    <cfqueryparam value="#practiceKey#"    cfsqltype="cf_sql_nvarchar"> AS practice_key
                ) AS source
                ON  target.user_id      = source.user_id
                AND target.practice_date = source.practice_date
                AND target.practice_key  = source.practice_key
                WHEN NOT MATCHED THEN
                    INSERT (user_id, practice_date, practice_key)
                    VALUES (source.user_id, source.practice_date, source.practice_key)
                OUTPUT INSERTED.completion_id, INSERTED.practice_date,
                       INSERTED.practice_key, INSERTED.completed_at;
            </cfquery>

            <cfreturn {
                success:      true,
                completionId: local.q.completion_id,
                practiceDate: local.q.practice_date,
                practiceKey:  local.q.practice_key,
                completedAt:  local.q.completed_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        uncompletePractice
        practices.cfc?method=uncompletePractice&token=...
                     &practiceDate=2026-06-04&practiceKey=morning
    --->
    <cffunction name="uncompletePractice" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery datasource="#variables.datasource#">
                DELETE FROM lglow.PracticeCompletions
                WHERE user_id      = <cfqueryparam value="#user.userId#"     cfsqltype="cf_sql_integer">
                  AND practice_date = <cfqueryparam value="#url.practiceDate#" cfsqltype="cf_sql_date">
                  AND practice_key  = <cfqueryparam value="#url.practiceKey#"  cfsqltype="cf_sql_nvarchar">
            </cfquery>

            <cfreturn { success: true } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getPracticesForDate
        practices.cfc?method=getPracticesForDate&token=...&practiceDate=2026-06-04
    --->
    <cffunction name="getPracticesForDate" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = authenticate() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT completion_id, practice_date, practice_key, completed_at
                FROM   lglow.PracticeCompletions
                WHERE  user_id      = <cfqueryparam value="#user.userId#"       cfsqltype="cf_sql_integer">
                  AND  practice_date = <cfqueryparam value="#url.practiceDate#" cfsqltype="cf_sql_date">
                ORDER BY completed_at ASC
            </cfquery>

            <cfreturn { success: true, completions: queryToArray(local.q) } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## practitioner.cfc

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        getClients
        practitioner.cfc?method=getClients&token=...
        Requires role = 'practitioner'
    --->
    <cffunction name="getClients" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user = requirePractitioner() />

            <cfquery name="local.q" datasource="#variables.datasource#">
                SELECT
                    u.user_id,
                    u.display_name,
                    u.email,
                    dr.primary_dosha,
                    MAX(ci.checkin_date)     AS last_checkin,
                    COUNT(ci.checkin_id)     AS checkin_count_30_days
                FROM lglow.PractitionerClients pc
                JOIN lglow.Users u
                    ON u.user_id = pc.client_user_id
                LEFT JOIN lglow.DoshaResults dr
                    ON dr.user_id = u.user_id AND dr.is_current = 1
                LEFT JOIN lglow.CheckIns ci
                    ON ci.user_id = u.user_id
                    AND ci.checkin_date >= CAST(DATEADD(DAY,-30,GETUTCDATE()) AS DATE)
                WHERE pc.practitioner_user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
                  AND pc.revoked_at IS NULL
                GROUP BY u.user_id, u.display_name, u.email, dr.primary_dosha
                ORDER BY last_checkin DESC
            </cfquery>

            <cfreturn { success: true, clients: queryToArray(local.q) } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message,
                cfcatch.errorcode eq "401" ? 401 :
                cfcatch.errorcode eq "403" ? 403 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        getClientSummary
        practitioner.cfc?method=getClientSummary&token=...&clientUserId=42
        Full pre-session briefing for one client.
    --->
    <cffunction name="getClientSummary" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user         = requirePractitioner() />
            <cfset var clientUserId = val(url.clientUserId) />

            <!--- Verify consent exists --->
            <cfquery name="local.consent" datasource="#variables.datasource#">
                SELECT relationship_id
                FROM   lglow.PractitionerClients
                WHERE  practitioner_user_id = <cfqueryparam value="#user.userId#"    cfsqltype="cf_sql_integer">
                  AND  client_user_id       = <cfqueryparam value="#clientUserId#"   cfsqltype="cf_sql_integer">
                  AND  revoked_at IS NULL
            </cfquery>
            <cfif local.consent.recordCount eq 0>
                <cfthrow message="Forbidden" errorcode="403" />
            </cfif>

            <!--- Profile --->
            <cfquery name="local.profile" datasource="#variables.datasource#">
                SELECT user_id, display_name, email, created_at
                FROM   lglow.Users
                WHERE  user_id = <cfqueryparam value="#clientUserId#" cfsqltype="cf_sql_integer">
            </cfquery>

            <!--- Current dosha --->
            <cfquery name="local.dosha" datasource="#variables.datasource#">
                SELECT TOP 1 primary_dosha, vata_score, pitta_score, kapha_score, taken_at
                FROM   lglow.DoshaResults
                WHERE  user_id    = <cfqueryparam value="#clientUserId#" cfsqltype="cf_sql_integer">
                  AND  is_current = 1
                ORDER BY taken_at DESC
            </cfquery>

            <!--- Check-in aggregates (last 30 days) --->
            <cfquery name="local.checkinAgg" datasource="#variables.datasource#">
                SELECT
                    COUNT(*)                             AS total,
                    MAX(checkin_date)                    AS last_checkin_date,
                    AVG(CAST(physical_score  AS FLOAT))  AS avg_physical,
                    AVG(CAST(mental_score    AS FLOAT))  AS avg_mental,
                    AVG(CAST(emotional_score AS FLOAT))  AS avg_emotional,
                    AVG(CAST(hunger_score    AS FLOAT))  AS avg_hunger,
                    AVG(CAST(tongue_score    AS FLOAT))  AS avg_tongue
                FROM lglow.CheckIns
                WHERE user_id     = <cfqueryparam value="#clientUserId#" cfsqltype="cf_sql_integer">
                  AND checkin_date >= CAST(DATEADD(DAY,-30,GETUTCDATE()) AS DATE)
            </cfquery>

            <!--- Five most recent check-ins with notes --->
            <cfquery name="local.recentCheckins" datasource="#variables.datasource#">
                SELECT TOP 5
                    checkin_date, checkin_type, physical_score,
                    mental_score, emotional_score, hunger_score,
                    tongue_score, note
                FROM   lglow.CheckIns
                WHERE  user_id = <cfqueryparam value="#clientUserId#" cfsqltype="cf_sql_integer">
                ORDER BY checkin_date DESC, checkin_type ASC
            </cfquery>

            <!--- Last 7 intentions --->
            <cfquery name="local.intentions" datasource="#variables.datasource#">
                SELECT TOP 7 intention_date, intention_text
                FROM   lglow.Intentions
                WHERE  user_id = <cfqueryparam value="#clientUserId#" cfsqltype="cf_sql_integer">
                ORDER BY intention_date DESC
            </cfquery>

            <!--- Last 5 journal entries (excerpts only) --->
            <cfquery name="local.journal" datasource="#variables.datasource#">
                SELECT TOP 5
                    entry_date,
                    LEFT(grateful_text, 100) AS grateful_excerpt
                FROM   lglow.JournalEntries
                WHERE  user_id = <cfqueryparam value="#clientUserId#" cfsqltype="cf_sql_integer">
                ORDER BY entry_date DESC
            </cfquery>

            <cfreturn {
                success: true,
                profile: {
                    userId:      local.profile.user_id,
                    displayName: local.profile.display_name,
                    email:       local.profile.email,
                    createdAt:   local.profile.created_at
                },
                dosha: local.dosha.recordCount gt 0 ? {
                    primaryDosha: local.dosha.primary_dosha,
                    vataScore:    local.dosha.vata_score,
                    pittaScore:   local.dosha.pitta_score,
                    kaphaScore:   local.dosha.kapha_score,
                    takenAt:      local.dosha.taken_at
                } : javaCast("null",""),
                checkins: {
                    last30Days:      local.checkinAgg.total,
                    lastCheckinDate: local.checkinAgg.last_checkin_date,
                    avgPhysical:     local.checkinAgg.avg_physical,
                    avgMental:       local.checkinAgg.avg_mental,
                    avgEmotional:    local.checkinAgg.avg_emotional,
                    avgHunger:       local.checkinAgg.avg_hunger,
                    avgTongue:       local.checkinAgg.avg_tongue,
                    recent:          queryToArray(local.recentCheckins)
                },
                intentions: queryToArray(local.intentions),
                journal:    queryToArray(local.journal)
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message,
                cfcatch.errorcode eq "401" ? 401 :
                cfcatch.errorcode eq "403" ? 403 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        addConsent
        practitioner.cfc?method=addConsent&token=...&clientUserId=42
    --->
    <cffunction name="addConsent" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user         = requirePractitioner() />
            <cfset var clientUserId = val(url.clientUserId) />

            <cfquery name="local.q" datasource="#variables.datasource#">
                MERGE lglow.PractitionerClients AS target
                USING (SELECT
                    <cfqueryparam value="#user.userId#"    cfsqltype="cf_sql_integer"> AS practitioner_user_id,
                    <cfqueryparam value="#clientUserId#"   cfsqltype="cf_sql_integer"> AS client_user_id
                ) AS source
                ON  target.practitioner_user_id = source.practitioner_user_id
                AND target.client_user_id       = source.client_user_id
                WHEN NOT MATCHED THEN
                    INSERT (practitioner_user_id, client_user_id)
                    VALUES (source.practitioner_user_id, source.client_user_id)
                WHEN MATCHED AND target.revoked_at IS NOT NULL THEN
                    UPDATE SET revoked_at = NULL, consented_at = GETUTCDATE()
                OUTPUT INSERTED.relationship_id, INSERTED.consented_at;
            </cfquery>

            <cfreturn {
                success:        true,
                relationshipId: local.q.relationship_id,
                consentedAt:    local.q.consented_at
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message,
                cfcatch.errorcode eq "401" ? 401 :
                cfcatch.errorcode eq "403" ? 403 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

    <!---
        revokeConsent
        practitioner.cfc?method=revokeConsent&token=...&clientUserId=42
        Soft-delete only — never hard-deletes the consent record.
    --->
    <cffunction name="revokeConsent" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user         = requirePractitioner() />
            <cfset var clientUserId = val(url.clientUserId) />

            <cfquery datasource="#variables.datasource#">
                UPDATE lglow.PractitionerClients
                SET    revoked_at = GETUTCDATE()
                WHERE  practitioner_user_id = <cfqueryparam value="#user.userId#"    cfsqltype="cf_sql_integer">
                  AND  client_user_id       = <cfqueryparam value="#clientUserId#"   cfsqltype="cf_sql_integer">
                  AND  revoked_at IS NULL
            </cfquery>

            <cfreturn { success: true } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message,
                cfcatch.errorcode eq "401" ? 401 :
                cfcatch.errorcode eq "403" ? 403 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## sync.cfc

Bulk-uploads local AsyncStorage data when a user logs in for the first time.
Called once on first login — subsequent writes go through individual endpoints.

```coldfusion
<cfcomponent extends="lglow.lglowBase" output="false">

    <!---
        bulkSync
        sync.cfc?method=bulkSync&token=...
        POST body (JSON): {
          doshaResult?:    { vataScore, pittaScore, kaphaScore },
          checkins?:       [{ checkinDate, checkinType, physicalScore, mentalScore,
                              emotionalScore, hungerScore, tongueScore, note }],
          journalEntries?: [{ entryDate, gratefulText, showedText, tomorrowText }],
          intentions?:     [{ intentionDate, intentionText }],
          practices?:      [{ practiceDate, practiceKey }]
        }
        Skips any record that already exists server-side (server wins on conflict).
    --->
    <cffunction name="bulkSync" access="remote" returntype="struct"
                returnformat="json" output="false">
        <cftry>
            <cfset var user   = authenticate() />
            <cfset var body   = deserializeJson(toString(getHttpRequestData().content)) />
            <cfset var synced = { dosha: false, checkins: 0, journal: 0, intentions: 0, practices: 0 } />
            <cfset var errors = [] />

            <!--- Dosha result --->
            <cfif structKeyExists(body, "doshaResult") and isStruct(body.doshaResult)>
                <cftry>
                    <!--- Only sync if no result exists yet — server wins --->
                    <cfquery name="local.existingDosha" datasource="#variables.datasource#">
                        SELECT COUNT(*) AS cnt FROM lglow.DoshaResults
                        WHERE user_id = <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">
                    </cfquery>
                    <cfif local.existingDosha.cnt eq 0>
                        <cfset var dr      = body.doshaResult />
                        <cfset var vata    = val(dr.vataScore)  />
                        <cfset var pitta   = val(dr.pittaScore) />
                        <cfset var kapha   = val(dr.kaphaScore) />
                        <cfset var primary = "vata" />
                        <cfif pitta gte vata and pitta gte kapha><cfset primary = "pitta" /></cfif>
                        <cfif kapha gte vata and kapha gte pitta><cfset primary = "kapha" /></cfif>

                        <cfquery datasource="#variables.datasource#">
                            INSERT INTO lglow.DoshaResults
                                (user_id, primary_dosha, vata_score, pitta_score, kapha_score, is_current)
                            VALUES (
                                <cfqueryparam value="#user.userId#" cfsqltype="cf_sql_integer">,
                                <cfqueryparam value="#primary#"     cfsqltype="cf_sql_nvarchar">,
                                <cfqueryparam value="#vata#"        cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#pitta#"       cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#kapha#"       cfsqltype="cf_sql_tinyint">,
                                1
                            )
                        </cfquery>
                        <cfset synced.dosha = true />
                    </cfif>
                    <cfcatch><cfset arrayAppend(errors, "dosha: #cfcatch.message#") /></cfcatch>
                </cftry>
            </cfif>

            <!--- Check-ins --->
            <cfif structKeyExists(body, "checkins") and isArray(body.checkins)>
                <cfloop array="#body.checkins#" item="local.ci">
                    <cftry>
                        <cfquery datasource="#variables.datasource#">
                            IF NOT EXISTS (
                                SELECT 1 FROM lglow.CheckIns
                                WHERE user_id      = <cfqueryparam value="#user.userId#"             cfsqltype="cf_sql_integer">
                                  AND checkin_date  = <cfqueryparam value="#local.ci.checkinDate#"   cfsqltype="cf_sql_date">
                                  AND checkin_type  = <cfqueryparam value="#local.ci.checkinType ?: 'morning'#" cfsqltype="cf_sql_nvarchar">
                            )
                            INSERT INTO lglow.CheckIns
                                (user_id, checkin_date, checkin_type, physical_score, mental_score,
                                 emotional_score, hunger_score, tongue_score, note)
                            VALUES (
                                <cfqueryparam value="#user.userId#"                          cfsqltype="cf_sql_integer">,
                                <cfqueryparam value="#local.ci.checkinDate#"                 cfsqltype="cf_sql_date">,
                                <cfqueryparam value="#local.ci.checkinType ?: 'morning'#"   cfsqltype="cf_sql_nvarchar">,
                                <cfqueryparam value="#val(local.ci.physicalScore)#"          cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#val(local.ci.mentalScore)#"            cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#val(local.ci.emotionalScore)#"         cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#val(local.ci.hungerScore)#"            cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#val(local.ci.tongueScore)#"            cfsqltype="cf_sql_tinyint">,
                                <cfqueryparam value="#local.ci.note ?: ''#"                  cfsqltype="cf_sql_nvarchar"
                                    null="#not structKeyExists(local.ci,'note') or not len(trim(local.ci.note))#">
                            )
                        </cfquery>
                        <cfset synced.checkins++ />
                        <cfcatch><cfset arrayAppend(errors, "checkin #local.ci.checkinDate#: #cfcatch.message#") /></cfcatch>
                    </cftry>
                </cfloop>
            </cfif>

            <!--- Journal entries --->
            <cfif structKeyExists(body, "journalEntries") and isArray(body.journalEntries)>
                <cfloop array="#body.journalEntries#" item="local.je">
                    <cftry>
                        <cfquery datasource="#variables.datasource#">
                            IF NOT EXISTS (
                                SELECT 1 FROM lglow.JournalEntries
                                WHERE user_id   = <cfqueryparam value="#user.userId#"          cfsqltype="cf_sql_integer">
                                  AND entry_date = <cfqueryparam value="#local.je.entryDate#"  cfsqltype="cf_sql_date">
                            )
                            INSERT INTO lglow.JournalEntries
                                (user_id, entry_date, grateful_text, showed_text, tomorrow_text)
                            VALUES (
                                <cfqueryparam value="#user.userId#"                 cfsqltype="cf_sql_integer">,
                                <cfqueryparam value="#local.je.entryDate#"          cfsqltype="cf_sql_date">,
                                <cfqueryparam value="#local.je.gratefulText ?: ''#" cfsqltype="cf_sql_nvarchar" null="#not structKeyExists(local.je,'gratefulText')#">,
                                <cfqueryparam value="#local.je.showedText   ?: ''#" cfsqltype="cf_sql_nvarchar" null="#not structKeyExists(local.je,'showedText')#">,
                                <cfqueryparam value="#local.je.tomorrowText ?: ''#" cfsqltype="cf_sql_nvarchar" null="#not structKeyExists(local.je,'tomorrowText')#">
                            )
                        </cfquery>
                        <cfset synced.journal++ />
                        <cfcatch><cfset arrayAppend(errors, "journal #local.je.entryDate#: #cfcatch.message#") /></cfcatch>
                    </cftry>
                </cfloop>
            </cfif>

            <!--- Intentions --->
            <cfif structKeyExists(body, "intentions") and isArray(body.intentions)>
                <cfloop array="#body.intentions#" item="local.intent">
                    <cftry>
                        <cfquery datasource="#variables.datasource#">
                            IF NOT EXISTS (
                                SELECT 1 FROM lglow.Intentions
                                WHERE user_id        = <cfqueryparam value="#user.userId#"               cfsqltype="cf_sql_integer">
                                  AND intention_date  = <cfqueryparam value="#local.intent.intentionDate#" cfsqltype="cf_sql_date">
                            )
                            INSERT INTO lglow.Intentions (user_id, intention_date, intention_text)
                            VALUES (
                                <cfqueryparam value="#user.userId#"                   cfsqltype="cf_sql_integer">,
                                <cfqueryparam value="#local.intent.intentionDate#"    cfsqltype="cf_sql_date">,
                                <cfqueryparam value="#local.intent.intentionText#"    cfsqltype="cf_sql_nvarchar">
                            )
                        </cfquery>
                        <cfset synced.intentions++ />
                        <cfcatch><cfset arrayAppend(errors, "intention #local.intent.intentionDate#: #cfcatch.message#") /></cfcatch>
                    </cftry>
                </cfloop>
            </cfif>

            <!--- Practice completions --->
            <cfif structKeyExists(body, "practices") and isArray(body.practices)>
                <cfloop array="#body.practices#" item="local.p">
                    <cftry>
                        <cfquery datasource="#variables.datasource#">
                            IF NOT EXISTS (
                                SELECT 1 FROM lglow.PracticeCompletions
                                WHERE user_id      = <cfqueryparam value="#user.userId#"          cfsqltype="cf_sql_integer">
                                  AND practice_date = <cfqueryparam value="#local.p.practiceDate#" cfsqltype="cf_sql_date">
                                  AND practice_key  = <cfqueryparam value="#local.p.practiceKey#"  cfsqltype="cf_sql_nvarchar">
                            )
                            INSERT INTO lglow.PracticeCompletions (user_id, practice_date, practice_key)
                            VALUES (
                                <cfqueryparam value="#user.userId#"          cfsqltype="cf_sql_integer">,
                                <cfqueryparam value="#local.p.practiceDate#" cfsqltype="cf_sql_date">,
                                <cfqueryparam value="#local.p.practiceKey#"  cfsqltype="cf_sql_nvarchar">
                            )
                        </cfquery>
                        <cfset synced.practices++ />
                        <cfcatch><cfset arrayAppend(errors, "practice #local.p.practiceDate#/#local.p.practiceKey#: #cfcatch.message#") /></cfcatch>
                    </cftry>
                </cfloop>
            </cfif>

            <cfreturn {
                success: true,
                synced:  synced,
                errors:  errors
            } />

        <cfcatch type="any">
            <cfreturn errorResponse(cfcatch.message, cfcatch.errorcode eq "401" ? 401 : 500) />
        </cfcatch>
        </cftry>
    </cffunction>

</cfcomponent>
```

---

## React Native API service layer

Drop this in `data/user/api.js`. It mirrors the AsyncStorage interface so
swapping the storage backend later only touches this file.

```js
import auth from '@react-native-firebase/auth';

const API_BASE = 'https://your-cf-server.com/lglow';

async function token() {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken(); // Firebase refreshes silently when needed
}

async function get(cfc, method, params = {}) {
  const t      = await token();
  const query  = new URLSearchParams({ token: t, ...params }).toString();
  const res    = await fetch(`${API_BASE}/${cfc}.cfc?method=${method}&${query}`);
  const json   = await res.json();
  if (!json.success) throw new Error(json.message ?? 'API error');
  return json;
}

async function post(cfc, method, body = {}) {
  const t   = await token();
  const res = await fetch(
    `${API_BASE}/${cfc}.cfc?method=${method}&token=${encodeURIComponent(t)}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? 'API error');
  return json;
}

// ── Users ──────────────────────────────────────────────────────────────────
export const getMe           = ()       => get('users', 'getMe');
export const updateMe        = (params) => get('users', 'updateMe', params);

// ── Dosha ──────────────────────────────────────────────────────────────────
export const saveDoshaResult  = (v,p,k) => get('dosha', 'saveDoshaResult',
                                              { vataScore: v, pittaScore: p, kaphaScore: k });
export const getCurrentDosha  = ()      => get('dosha', 'getCurrentDosha');
export const getDoshaHistory   = ()      => get('dosha', 'getDoshaHistory');

// ── Check-ins ──────────────────────────────────────────────────────────────
export const saveCheckin      = (values, note) => get('checkins', 'saveCheckin', {
  checkinDate:    new Date().toISOString().slice(0,10),
  checkinType:    'morning',
  physicalScore:  values.physical,
  mentalScore:    values.mental,
  emotionalScore: values.emotional,
  hungerScore:    values.hunger,
  tongueScore:    values.tongue,
  ...(note ? { note } : {}),
});
export const getCheckins      = (days=7) => get('checkins', 'getCheckins', { days });

// ── Journal ────────────────────────────────────────────────────────────────
export const saveJournalEntry = (date, fields) => get('journal', 'saveJournalEntry',
                                                    { entryDate: date, ...fields });
export const getJournalEntry  = (date)  => get('journal', 'getJournalEntry', { entryDate: date });
export const getJournalList   = (limit=20, offset=0) =>
                                  get('journal', 'getJournalList', { limit, offset });

// ── Intentions ─────────────────────────────────────────────────────────────
export const saveIntention    = (date, text) => get('intentions', 'saveIntention',
                                                  { intentionDate: date, intentionText: text });
export const getIntention     = (date) => get('intentions', 'getIntention', { intentionDate: date });

// ── Practices ──────────────────────────────────────────────────────────────
export const completePractice   = (date, key) => get('practices', 'completePractice',
                                                    { practiceDate: date, practiceKey: key });
export const uncompletePractice = (date, key) => get('practices', 'uncompletePractice',
                                                    { practiceDate: date, practiceKey: key });
export const getPracticesForDate = (date)     => get('practices', 'getPracticesForDate',
                                                    { practiceDate: date });

// ── Sync ───────────────────────────────────────────────────────────────────
export const bulkSync = (payload) => post('sync', 'bulkSync', payload);
```

---

## Cost comparison

| | ColdFusion / MSSQL | Supabase Pro |
|---|---|---|
| Monthly cost | $0 (uses existing server) | $25/month |
| Auth | Firebase (free) | Firebase (free) |
| Ramp-up | Low (familiar stack) | Medium (new tool) |
| SQL reporting | ✅ Full T-SQL | ✅ Full Postgres SQL |
| Ops burden | Shared with panda-mobile | Managed by Supabase |
| Scale ceiling | Existing server capacity | Effectively unlimited |
| Best for | Budget-constrained early stage | Clean separation, long-term |

**Decision trigger:** If Thea's budget is tight post-demo, use this. If the budget is there, Supabase is the cleaner long-term foundation. The app-side API service layer (`data/user/api.js`) is identical either way — switching backends later only touches that file and the ColdFusion vs Supabase implementation, not any screen code.
