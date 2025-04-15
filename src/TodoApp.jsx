import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function TodoApp() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 讀取任務
  const fetchTodos = async () => {
    setLoading(true);
    console.log('📥 正在讀取任務資料...');
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 讀取錯誤：', error);
    } else {
      console.log('✅ 取得任務：', data);
      setTodos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 新增任務
  const addTodo = async () => {
    if (!task.trim()) {
      console.log('⚠️ 輸入為空，未新增任何任務');
      return;
    }

    console.log('🚀 新增任務中...', task);

    const { data, error } = await supabase
      .from('todos')
      .insert([{ content: task, is_complete: false }]);

    if (error) {
      console.error('❌ 新增任務錯誤：', error);
    } else {
      console.log('✅ 任務新增成功：', data);
      setTask('');
      fetchTodos();
    }
  };

  // 勾選任務完成
  const toggleComplete = async (todo) => {
    console.log(`🔄 切換完成狀態：${todo.content} (${todo.id})`);
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id);
    if (error) {
      console.error('❌ 更新錯誤：', error);
    } else {
      console.log('✅ 完成狀態已更新');
      fetchTodos();
    }
  };

  // 刪除任務
  const deleteTodo = async (id) => {
    console.log(`🗑️ 嘗試刪除任務 ID：${id}`);
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.error('❌ 刪除錯誤：', error);
    } else {
      console.log('✅ 任務刪除成功');
      fetchTodos();
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '1rem' }}>📋 待辦清單</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="輸入新任務"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={addTodo} style={{ padding: '0.5rem 1rem' }}>新增</button>
      </div>

      {loading ? (
        <p>載入中...</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              backgroundColor: '#f8f8f8',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={todo.is_complete}
                onChange={() => toggleComplete(todo)}
              />
              <span
                style={{
                  textDecoration: todo.is_complete ? 'line-through' : 'none',
                  color: todo.is_complete ? '#888' : '#000'
                }}
              >
                {todo.content}
              </span>
            </label>
            <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red', border: 'none', background: 'none' }}>
              刪除
            </button>
          </div>
        ))
      )}
    </div>
  );
}
