const pool = require("./pool.js");

async function createUser(user, hashedPassword) {
  try {
    await pool.query(
      `INSERT INTO users (firstname, lastname, username, password)
        VALUES ($1, $2, $3, $4)`, [user.firstname, user.lastname, user.username, hashedPassword]
    );
  } catch(error) {
    console.error("Error creating user: ", error.message)
    throw error;
  }
}

async function createMessage(username, title, message) {
  try {
    await pool.query(
      `INSERT INTO messages (username, title, time, message)
      VALUES ($1, $2, NOW(), $3)`, [username, title, message]
    );
  } catch (error) {
    console.error("Error creating message: ", error.message)
    throw error;
  }
}

async function createMember(username) {
  try {
    await pool.query(`
      UPDATE users
      SET is_member = TRUE
      WHERE username = $1
    `, [username]);
  } catch (error) {
    console.error("Error creating member: ", error.message);
    throw error
  }
}

async function getAllMessages() {
  try {
    const results = await pool.query(`
      SELECT 
        users.id, 
        users.firstname, 
        users.lastname, 
        users.username,
        users.is_member, 
        messages.id AS message_id,
        messages.title, 
        messages.time, 
        messages.message 
      FROM users JOIN messages 
      ON users.username = messages.username
    `);

    return results.rows.map( result => {
      const date = new Date()
    })
    
  } catch(error) {
    console.error("Error finding messages from DB:", error.message);
    throw error;
  }
}


async function getMessagesByUsername(username) {
  try {
    const result = await pool.query(`
      SELECT * FROM messages
      WHERE username = $1
    `, [username]);

    return result.rows;
  } catch(error) {
      console.error("Error finding messges from DB:", error.message);
      throw error;
  }
}

async function deleteMessageByID(id) {
  try {
    await pool.query(`
      DELETE FROM messages 
      WHERE messages.id = $1
    `, [id]);
  } catch (error) {
    console.error("Error deleting messages: ", error.message);
    throw error;
  }
}

module.exports = {
  createUser,
  createMessage,
  createMember,
  getAllMessages,
  getMessagesByUsername,
  deleteMessageByID,
}