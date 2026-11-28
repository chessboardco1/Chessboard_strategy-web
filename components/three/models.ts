import type { PieceType } from '@/lib/content';

export const GROWTH_BOARD_MODEL = '/models/growth-board.glb';

/** Relative heights in board squares, after a tournament Staunton set. */
export const PIECE_HEIGHT: Record<PieceType, number> = {
  king: 1.62,
  queen: 1.44,
  bishop: 1.2,
  knight: 1.06,
  rook: 0.96,
  pawn: 0.8,
};
