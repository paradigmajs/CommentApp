import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {addComment, fetchComments, Comment} from '../database/database';
import {formatDate} from '../constants';

interface CommentScreenProps {
  route: any;
}

const CommentScreen: React.FC<CommentScreenProps> = ({route}) => {
  const {userId} = route.params;
  const [text, setText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState<number>(0);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    loadComments();
  }, [page]);

  const loadComments = useCallback(() => {
    console.log(`Loading comments for page: ${page}`);
    setLoading(true);
    fetchComments(25, page * 25, (newComments: Comment[]) => {
      console.log(`Fetched ${newComments.length} comments`);
      if (newComments.length < 25) {
        setHasMore(false);
      }

      if (page === 0) {
        setComments(newComments);
      } else {
        setComments(prevComments => [...prevComments, ...newComments]);
      }

      setLoading(false);
    });
  }, [page]);

  const handleAddComment = useCallback(() => {
    if (text) {
      setSubmitting(true);
      addComment(userId, replyTo ? replyTo.id : null, text, () => {
        setText('');
        setReplyTo(null);
        setPage(0);
        loadComments();
        setSubmitting(false);
      });
    }
  }, [text, userId, replyTo, loadComments]);

  const renderNestedComments = (comment: Comment) => {
    const replies = comments.filter(c => c.parent_comment_id === comment.id);

    const parentComment = comment.parent_comment_id
      ? comments.find(c => c.id === comment.parent_comment_id)
      : null;

    return (
      <View
        key={comment.id}
        style={[
          styles.commentContainer,
          {
            marginTop: comment.parent_comment_id ? 15 : 0,
            marginLeft: comment.parent_comment_id ? 15 : 0,
            backgroundColor: comment.parent_comment_id ? '#f4f4f4' : '#fff',
          },
        ]}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>User: {comment.user_email}</Text>
          <Text style={styles.commentDate}>{formatDate(comment.date)}</Text>
        </View>

        {parentComment && (
          <Text style={styles.parentCommentText}>
            Replying to: "
            {parentComment.text.length > 25
              ? parentComment.text.slice(0, 25) + '...'
              : parentComment.text}
            "
          </Text>
        )}

        <Text style={styles.commentText}>{comment.text}</Text>
        <TouchableOpacity onPress={() => setReplyTo(comment)}>
          <Text style={styles.replyButton}>Reply</Text>
        </TouchableOpacity>
        {replies.map(reply => renderNestedComments(reply))}
      </View>
    );
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <View style={styles.commentsContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={comments.filter(c => c.parent_comment_id === null)}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => renderNestedComments(item)}
            style={styles.commentsBlock}
            onEndReached={() => {
              if (hasMore && !loading) {
                setPage(prevPage => prevPage + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {replyTo && (
        <View style={styles.replyInfoContainer}>
          <Text style={styles.replyingToText}>Replying to: {replyTo.text}</Text>
          <Button title="Cancel" onPress={handleCancelReply} />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={replyTo ? 'Replying to comment...' : 'Add a comment'}
        />
        <Button
          title={replyTo ? 'Reply' : 'Add Comment'}
          onPress={handleAddComment}
          disabled={submitting || !text}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsContainer: {
    flex: 1,
    padding: 10,
  },
  commentsBlock: {
    flex: 1,
  },
  commentContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentDate: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  replyButton: {
    color: '#007BFF',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  parentCommentText: {
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 5,
  },
  replyInfoContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  replyingToText: {
    fontStyle: 'italic',
  },
});

export default CommentScreen;
