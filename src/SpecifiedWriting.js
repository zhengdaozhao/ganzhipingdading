import { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, onValue, ref, push } from '@react-native-firebase/database';

export default function SpecifiedWriting({ navigation,route }) {
  const { item } = route.params || {};
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 提取 subject 值
  const getSubjectValue = () => {
    try {
      if (item && item.allsub) {
        const parsedData = typeof item.allsub === 'string' ? JSON.parse(item.allsub) : item.allsub;
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData[0]?.key || '';
        } else if (parsedData && typeof parsedData === 'object') {
          return parsedData.key || '';
        }
      }
      return '';
    } catch (error) {
      console.error('Error parsing allsub:', error);
      return '';
    }
  };

  const subjectValue = getSubjectValue();

  useEffect(() => {
    if (!subjectValue) {
      setError('Invalid subject value');
      setLoading(false);
      return;
    }

    const db = getDatabase();
    // 监听 zack/writing 路径下的数据
    const writingsRef = ref(db, 'zack/writing');

    const unsubscribe = onValue(writingsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        console.log('Writings Firebase data:', data);
        
        if (data) {
          // 过滤出 subject 值匹配的文档
          const filteredWritings = Object.entries(data)
            .filter(([id, writing]) => 
              writing && writing.subject === subjectValue
            )
            .map(([id, writing]) => ({
              id,
              ...writing
            }));
          
          setWritings(filteredWritings);
        } else {
          setWritings([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching writings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, (firebaseError) => {
      console.error('Firebase error:', firebaseError);
      setError(firebaseError.message);
      setLoading(false);
    });

    // 清理订阅
    return () => unsubscribe();
  }, [subjectValue]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading writings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 16 }}>Error: {error}</Text>
        <Text style={{ marginTop: 10 }}>Subject Value: {subjectValue}</Text>
      </View>
    );
  }

  // 处理写作项点击事件
  const handleWritingItemPress = (writing, index) => {
    // console.log(`Writing item pressed: ${writing.title || writing.subject}`, writing);
    // Alert.alert(
    //   `Writing Selected`,
    //   `Subject: ${writing.subject}\nTitle: ${writing.title || 'No title'}\nID: ${writing.id}`
    // );
    
    // 在这里添加更多业务逻辑，例如导航到详情页面
    navigation.navigate('kuangcaozhaojing', { writing });
  };

  // 处理添加条目
  const handleAddWriting = async () => {
    if (!titleInput.trim() || !contentInput.trim()) {
      Alert.alert('提示', '标题和内容不能为空');
      return;
    }

    setSubmitting(true);
    try {
      const db = getDatabase();
      const writingsRef = ref(db, 'zack/writing');
      
      const newWriting = {
        _id: '',
        beginday: new Date().toISOString(),
        modday: '',
        sample: contentInput,
        subject: subjectValue,
        title: titleInput,
        username: 'zhoujiandong'
      };

      await push(writingsRef, newWriting);
      
      // 清空输入框和关闭弹窗
      setTitleInput('');
      setContentInput('');
      setAddModalVisible(false);
      Alert.alert('成功', '条目已添加');
    } catch (err) {
      console.error('Error adding writing:', err);
      Alert.alert('错误', '添加条目失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理关闭弹窗
  const handleCloseAddModal = () => {
    setTitleInput('');
    setContentInput('');
    setAddModalVisible(false);
  };

  // 渲染单个写作项
  const renderWritingItem = ({ item: writing, index }) => (
    <TouchableOpacity 
      style={{ 
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2
      }}
      onPress={() => handleWritingItemPress(writing, index)}
      activeOpacity={0.7}
    >
      {/* <Text style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333',
        marginBottom: 5
      }}>
        {writing.subject}
      </Text> */}
      {writing.title && (
        <Text style={{ 
          fontSize: 14, 
          color: '#666',
          marginBottom: 3
        }}>
          {writing.title}
        </Text>
      )}
      {writing.content && (
        <Text 
          numberOfLines={2}
          style={{ 
            fontSize: 13, 
            color: '#888' 
          }}
        >
          {writing.content}
        </Text>
      )}
      {writing.createdAt && (
        <Text style={{ 
          fontSize: 12, 
          color: '#aaa', 
          marginTop: 5 
        }}>
          Created: {new Date(writing.createdAt).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ 
        backgroundColor: '#fff', 
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd' 
      }}>
        {/* <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: '#333' 
        }}>
          Writings for: {subjectValue}
        </Text> */}
        {/* <Text style={{ 
          fontSize: 14, 
          color: '#666', 
          marginTop: 5 
        }}>
          Found {writings.length} item(s)
        </Text> */}
      </View>
      
      {writings.length === 0 ? (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20
        }}>
          <Text style={{ fontSize: 16, color: '#888' }}>
            No writings found for this subject
          </Text>
        </View>
      ) : (
        <FlatList
          data={writings}
          renderItem={renderWritingItem}
          keyExtractor={(item, index) => item.id ? item.id.toString() : `writing-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}

      {/* 追加条目按钮 */}
      <View style={{ padding: 15, backgroundColor: '#f5f5f5' }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>+ 追加条目</Text>
        </TouchableOpacity>
      </View>

      {/* 追加条目弹窗 */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>追加新条目</Text>

            <Text style={styles.label}>标题</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入标题"
              placeholderTextColor="#999"
              value={titleInput}
              onChangeText={setTitleInput}
              editable={!submitting}
            />

            <Text style={styles.label}>内容</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="请输入内容"
              placeholderTextColor="#999"
              value={contentInput}
              onChangeText={setContentInput}
              multiline
              editable={!submitting}
            />

            {/* 按钮组 */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseAddModal}
                disabled={submitting}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.okButton, submitting && styles.okButtonDisabled]}
                onPress={handleAddWriting}
                disabled={submitting}
                activeOpacity={0.7}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.okButtonText}>确定</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#3478f6',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3478f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2430',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e9ef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  contentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  okButton: {
    backgroundColor: '#3478f6',
  },
  okButtonDisabled: {
    opacity: 0.7,
  },
  okButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});