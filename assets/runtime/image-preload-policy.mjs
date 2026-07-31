export function normalizedViewportDistance(rect, viewport) {
  const width = Math.max(Number(viewport?.width) || 0, 1);
  const height = Math.max(Number(viewport?.height) || 0, 1);
  const horizontal = rect.right < 0
    ? -rect.right
    : rect.left > width
      ? rect.left - width
      : 0;
  const vertical = rect.bottom < 0
    ? -rect.bottom
    : rect.top > height
      ? rect.top - height
      : 0;

  return Math.hypot(horizontal / width, vertical / height);
}

export function candidateViewportDistance(candidate, viewport) {
  let nearest = Number.POSITIVE_INFINITY;
  for (const anchor of candidate.anchors || []) {
    if (!anchor?.isConnected || typeof anchor.getBoundingClientRect !== "function") continue;
    nearest = Math.min(nearest, normalizedViewportDistance(anchor.getBoundingClientRect(), viewport));
  }
  return nearest;
}

export function rankImageCandidates(candidates, viewport) {
  return [...candidates]
    .map(candidate => ({
      candidate,
      distance: candidateViewportDistance(candidate, viewport)
    }))
    .sort((left, right) => left.distance - right.distance || left.candidate.order - right.candidate.order)
    .map(entry => entry.candidate);
}

export function preloadConcurrency(connection) {
  const constrained = Boolean(connection?.saveData)
    || /^(?:slow-2g|2g|3g)$/.test(connection?.effectiveType || "");
  return constrained ? 1 : 3;
}

