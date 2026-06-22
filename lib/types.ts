export type Board = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  theme_id: string;
  font: string;
  color: string;
  visibility: "public" | "private";
  slug: string;
  is_archived: boolean;
};

export type CreateBoardInput = {
  title: string;
  description?: string;
  theme_id: string;
  font: string;
  color: string;
  visibility: string;
};

export type Message = {
  id: string;
  board_id: string;
  author_name: string;
  author_id: string | null;
  content: string;
  color: string;
  font: string;
  position_x: number;
  position_y: number;
  rotation: number;
  created_at: string;
};

export type CreateMessageInput = {
  board_id: string;
  author_name: string;
  content: string | null;
  color: string;
  drawing?: string;
};
