export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function dragRoom(pan, delta, viewport) {
  return {
    x: clamp(pan.x + delta.x / (viewport.width * 0.35), -1, 1),
    y: clamp(pan.y + delta.y / (viewport.height * 0.35), -1, 1),
  };
}
export function edgeVelocity(point, viewport) {
  const speed = (position, extent) => {
    const zone = Math.min(110, extent * 0.15);
    if (position < zone) return -clamp((zone - position) / zone, 0, 1);
    if (position > extent - zone) return clamp((position - extent + zone) / zone, 0, 1);
    return 0;
  };
  return { x: speed(point.x, viewport.width), y: speed(point.y, viewport.height) };
}
export function advanceRoom(pan, velocity, elapsedSeconds) {
  return {
    x: clamp(pan.x + velocity.x * elapsedSeconds * 0.8, -1, 1),
    y: clamp(pan.y + velocity.y * elapsedSeconds * 0.8, -1, 1),
  };
}
