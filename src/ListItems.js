// import { useState, useEffect } from 'react';
// import { View, FlatList,Text } from 'react-native';
// import { getDatabase, onValue, ref } from '@react-native-firebase/database';
// // export default function ListItems() {
// //   const [items, setItems] = useState([]);

// //   useEffect(() => {
// //     const db = getDatabase();
// //     const itemsRef = ref(db, 'zack/initdson');

// //     onValue(itemsRef, (snapshot) => {
// //       const data = snapshot.val();
// //       const itemsArray = Object.values(data);
// //       setItems(itemsArray);
// //     });
// //   }, []);

// //   return (
// //     <View>
// //       <FlatList
// //         data={items}
// //         renderItem={({ item }) => (
// //           <View>
// //             {/* <Text>{item.text}</Text>
// //             <Text>{item.username}</Text>
// //             <Text>{item.chname}</Text> */}
// //             <Text>{item.allsub}</Text>
// //             {/* <Text>{item.createdAt}</Text> */}
// //           </View>
// //         )}
// //         keyExtractor={(item, index) => {
// //           // 添加安全检查
// //           return item.id ? item.id.toString() : index.toString();
// //         }}
// //       />
// //     </View>
// //   );
// // }
// export default function ListItems() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const db = getDatabase();
//     const itemsRef = ref(db, 'zack/initdson');

//     const unsubscribe = onValue(itemsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         console.log('Firebase data:', data);
        
//         if (data) {
//           const itemsArray = Object.values(data).filter(item => item !== null && item !== undefined);
//           setItems(itemsArray);
//         } else {
//           setItems([]);
//         }
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }, (error) => {
//       console.error('Firebase error:', error);
//       setError(error.message);
//       setLoading(false);
//     });

//     // 清理订阅
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <View>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   // 辅助函数，解析 allsub 并返回 key 值
//   const renderAllSubKeys = (allsub, index) => {
//     if (!allsub) {
//       return <Text>Item {index} - No allsub property</Text>;
//     }

//     // 首先检查是否已经是对象（而非字符串）
//     let parsedData;
    
//     if (typeof allsub === 'string') {
//       // 如果是字符串，尝试解析 JSON
//       try {
//         parsedData = JSON.parse(allsub);
//       } catch (parseError) {
//         console.error(`Error parsing allsub at index ${index}:`, parseError);
//         console.log(`Raw allsub value:`, allsub, 'Type:', typeof allsub);
//         return <Text>Item {index} - Invalid JSON: {String(allsub)}</Text>;
//       }
//     } else if (typeof allsub === 'object') {
//       // 如果已经是对象，直接使用
//       parsedData = allsub;
//     } else {
//       return <Text>Item {index} - Unexpected data type: {typeof allsub}</Text>;
//     }

//     // 处理解析后的数据
//     if (Array.isArray(parsedData)) {
//       // 如果是数组，提取所有 key 值
//       const keys = parsedData
//         .filter(item => item && typeof item === 'object' && item.key)
//         .map(item => item.key)
//         .join(', ');
//       return <Text>{keys || `Item ${index} - No keys found in array`}</Text>;
//     } 
//     else if (typeof parsedData === 'object' && parsedData !== null) {
//       // 如果是单个对象
//       return <Text>{parsedData.key || `Item ${index} - No key found in object`}</Text>;
//     }
//     else {
//       return <Text>Item {index} - Data is not an object or array</Text>;
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={items}
//         renderItem={({ item, index }) => (
//           <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
//             <Text>
//               {String(JSON.parse(item.allsub)[0].key).replace(String(JSON.parse(item.allsub)[0].label),'')}
//             </Text>
//             {/* <Text> {item.allsub} </Text> */}
//           </View>
//         )}
//         keyExtractor={(item, index) => {
//           // 尝试使用 id，如果不存在则使用索引
//           return item.id ? item.id.toString() : `item-${index}`;
//         }}
//       />
//     </View>
//   );
// }
import { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';

export default function ListItems({navigation}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labels, setLabels] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const itemsRef = ref(db, 'zack/initdson');

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        console.log('Firebase data:', data);
        
        if (data) {
          const itemsArray = Object.values(data).filter(item => item !== null && item !== undefined);
          setItems(itemsArray);
        } else {
          setItems([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setError(error.message);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // Handler for when a list item is pressed
  const handleListItemPress = (item, index) => {
    // 解析 allsub 并提取所有 label
    const labelData = extractLabels(item.allsub);
    
    if (labelData.length === 1) {
      // 如果只有一个 label，直接导航
      const singleItem = {
        ...item,
        allsub: JSON.stringify([labelData[0].fullItem])
      };
      navigation.navigate('houruzhiping', { item: singleItem });
    } else if (labelData.length > 1) {
      // 如果有多个 label，显示选择窗口
      setLabels(labelData);
      setCurrentItem(item);
      setShowLabelModal(true);
    }
  };

  // 当用户选择一个 label 时
  const handleLabelSelect = (selectedLabelData) => {
    setShowLabelModal(false);
    const filteredItem = {
      ...currentItem,
      allsub: JSON.stringify([selectedLabelData.fullItem])
    };
    navigation.navigate('houruzhiping', { item: filteredItem });
  };

  // 从 allsub 中解析并提取所有 label
  const extractLabels = (allsub) => {
    try {
      const parsedData = typeof allsub === 'string' ? JSON.parse(allsub) : allsub;
      if (Array.isArray(parsedData)) {
        return parsedData.map(obj => ({
          label: obj.label,
          fullItem: obj
        }));
      }
      return [];
    } catch (error) {
      console.error('Error extracting labels:', error);
      return [];
    }
  };

  // Helper function to extract the key from allsub
  const extractKey = (allsub) => {
    try {
      const parsedData = typeof allsub === 'string' ? JSON.parse(allsub) : allsub;
      
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const firstItem = parsedData[0];
        if (firstItem && typeof firstItem === 'object' && firstItem.key && firstItem.label) {
          // Remove the label part from the key
          return String(firstItem.key).replace(String(firstItem.label), '');
        } else {
          return firstItem?.key || 'No Key Found';
        }
      } else if (parsedData && typeof parsedData === 'object') {
        return parsedData.key || 'No Key Found';
      }
      return 'Invalid Data';
    } catch (error) {
      console.error('Error extracting key:', error);
      return 'Parse Error';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={{ 
              padding: 15, 
              borderBottomWidth: 1, 
              borderBottomColor: '#ccc',
              backgroundColor: '#fff'
            }}
            onPress={() => handleListItemPress(item, index)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              {extractKey(item.allsub)}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => {
          return item.id ? item.id.toString() : `item-${index}`;
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Label Selection Modal */}
      <Modal
        visible={showLabelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLabelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>请选择分类</Text>
            <ScrollView style={styles.labelList}>
              {labels.map((labelData, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.labelItem}
                  onPress={() => handleLabelSelect(labelData)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.labelText}>{labelData.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLabelModal(false)}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 24,
    paddingHorizontal: 20,
    maxHeight: '70%',
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2430',
    marginBottom: 16,
    textAlign: 'center',
  },
  labelList: {
    marginBottom: 16,
    maxHeight: 300,
  },
  labelItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ef',
  },
  labelText: {
    fontSize: 16,
    color: '#3478f6',
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e6e9ef',
    alignItems: 'center',
    marginBottom: 0,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});