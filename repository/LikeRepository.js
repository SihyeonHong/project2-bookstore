import Database from "./../mariadb.js";

export default class LikeRepository {
  async addLike(userId, likedBook) {
    const sql = "INSERT INTO likes (user_id, liked_book) VALUES (?, ?)";
    const values = [userId, likedBook];
    return await Database.runQuery(sql, values);
  }

  async deleteLike(userId, likedBook) {
    const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book = ?";
    const values = [userId, likedBook];
    return await Database.runQuery(sql, values);
  }
}
