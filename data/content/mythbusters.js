// DRAFT — 'take' and 'reframe' for each entry await Thea's authorship.
// Do not add entries without Thea naming the myth.
// Do not fill 'take' or 'reframe' without her content.

export const mythbusters = [
  {
    id: 'fat-free',
    weekStart: '2026-05-04',
    myth: 'Fat-free food is healthy food.',
    take: null,    // awaiting Thea
    reframe: null, // awaiting Thea
  },
];

// Returns the current week's entry only when it has content. Null otherwise.
export function currentMythbuster() {
  const today = new Date();
  return mythbusters.find(({ weekStart, take }) => {
    if (!take) return false;
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return today >= start && today <= end;
  }) ?? null;
}
