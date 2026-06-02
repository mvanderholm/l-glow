import { View, Image, Pressable, Text, StyleSheet, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchRecentPosts, INSTAGRAM_HANDLE } from '../data/instagram';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 2;
const TILE_SIZE = Math.floor((SCREEN_WIDTH - 48 - GRID_GAP * 2) / 3); // 3 columns, padding accounted for

export default function InstagramFeed() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { spacing, radius, type } = theme;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const styles = makeStyles(c, spacing, radius);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={type.label}>From Thea</Text>
        <Pressable onPress={() => Linking.openURL(`https://instagram.com/${INSTAGRAM_HANDLE}`)}>
          <Text style={[type.muted, { fontSize: 12 }]}>@{INSTAGRAM_HANDLE}</Text>
        </Pressable>
      </View>

      {loading && (
        <ActivityIndicator color={c.accent} style={{ marginTop: spacing.lg }} />
      )}

      {error && !loading && (
        <Text style={[type.muted, { fontSize: 13, textAlign: 'center', marginTop: spacing.md }]}>
          Couldn't load posts right now.
        </Text>
      )}

      {!loading && !error && posts.length === 0 && (
        <Text style={[type.muted, { fontSize: 13, textAlign: 'center', marginTop: spacing.md }]}>
          No posts yet.
        </Text>
      )}

      {!loading && posts.length > 0 && (
        <View style={styles.grid}>
          {posts.map(post => {
            const imageUrl =
              post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            const isVideo = post.media_type === 'VIDEO';

            return (
              <Pressable
                key={post.id}
                style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}
                onPress={() => Linking.openURL(post.permalink)}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {isVideo && (
                  <View style={styles.videoIndicator}>
                    <Text style={styles.videoIcon}>▶</Text>
                  </View>
                )}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <View style={styles.carouselIndicator}>
                    <Text style={styles.carouselIcon}>⧉</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function makeStyles(c, spacing, radius) {
  return StyleSheet.create({
    wrapper: {
      alignSelf: 'stretch',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GRID_GAP,
    },
    tile: {
      width: TILE_SIZE,
      height: TILE_SIZE,
      backgroundColor: c.surface,
      borderRadius: radius.sm,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    videoIndicator: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderRadius: 4,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    videoIcon: {
      color: '#fff',
      fontSize: 10,
    },
    carouselIndicator: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderRadius: 4,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    carouselIcon: {
      color: '#fff',
      fontSize: 11,
    },
  });
}
