import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'CommentAppDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

export const createTables = (): void => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, username TEXT NOT NULL)`,
      [],
      () => {
        console.log('Users table created successfully');
      },
      error => {
        console.log('Error creating users table: ' + error.message);
      },
    );

    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id INTEGER, 
        parent_comment_id INTEGER, 
        text TEXT NOT NULL, 
        date TEXT NOT NULL, 
        FOREIGN KEY(user_id) REFERENCES users(id), 
        FOREIGN KEY(parent_comment_id) REFERENCES comments(id)
      )`,
      [],
      () => {
        console.log('Comments table created successfully');
      },
      error => {
        console.log('Error creating comments table: ' + error.message);
      },
    );
  });
};

export type CommentCallback = (comments: Comment[]) => void;

export interface Comment {
  id: number;
  user_id: number;
  parent_comment_id: number | null;
  text: string;
  date: string;
}

export const addUser = (
  email: string,
  username: string,
  callback: (userId: number) => void,
): void => {
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO users (email, username) VALUES (?, ?)`,
      [email, username],
      (txn, results) => callback(results.insertId),
      error => {
        console.log('Error adding user: ' + error.message);
      },
    );
  });
};

export const addComment = (
  userId: number,
  parentId: number | null,
  text: string,
  callback: (commentId: number) => void,
): void => {
  const currentDate = new Date().toISOString();
  console.log(
    `Adding comment: userId=${userId}, parentId=${parentId}, text="${text}", date="${currentDate}"`,
  );
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO comments (user_id, parent_comment_id, text, date) VALUES (?, ?, ?, ?)`,
      [userId, parentId, text, currentDate],
      (txn, results) => {
        console.log('Comment added successfully, ID:', results.insertId);
        callback(results.insertId);
      },
      error => {
        console.log('Error adding comment: ' + error.message);
      },
    );
  });
};

export const fetchComments = (
  limit: number,
  offset: number,
  callback: CommentCallback,
): void => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT comments.*, users.email AS user_email FROM comments JOIN users ON comments.user_id = users.id ORDER BY date DESC LIMIT ? OFFSET ?`,
      [limit, offset],
      (txn, results) => {
        let rows = results.rows;
        let comments: Comment[] = [];
        for (let i = 0; i < rows.length; i++) {
          comments.push(rows.item(i));
        }
        callback(comments);
      },
      error => {
        console.log('Error fetching comments: ' + error.message);
      },
    );
  });
};

export const clearDatabase = () => {
  db.transaction(txn => {
    txn.executeSql('DROP TABLE IF EXISTS comments', [], () => {
      console.log('Comments table dropped');
      createTables();
    });
    txn.executeSql('DROP TABLE IF EXISTS users', [], () => {
      console.log('Users table dropped');
      createTables();
    });
  });
};
