'use client';
import { useState, useCallback } from 'react';
import SceneSelector from './components/SceneSelector';
import SceneConfig from './components/SceneConfig';
import CopyEditor from './components/CopyEditor';
import CopyPreview from './components/CopyPreview';

export default function Home() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [sceneConfig, setSceneConfig] = useState<any>({});
  const [generatedCopy, setGeneratedCopy] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSceneSelect = useCallback((sceneId: string) => {
    setSelectedScene(sceneId);
    setGeneratedCopy('');
  }, []);

  const handleConfigChange = useCallback((config: any) => {
    setSceneConfig(config);
  }, []);

  const handleCopyChange = useCallback((content: string) => {
    setGeneratedCopy(content);
  }, []);

  const generateCopy = async () => {
    if (!selectedScene) {
      alert('请先选择一个文案场景');
      return;
    }

    // 验证必填字段
    const requiredFields = getRequiredFields(selectedScene);
    const missingFields = requiredFields.filter(field => !sceneConfig[field]?.trim());
    if (missingFields.length > 0) {
      alert(`请填写必填字段：${missingFields.join('、')}`);
      return;
    }

    setLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8015';
      const response = await fetch(`${API_URL}/xiaohongshu/copy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scene: selectedScene,
          config: sceneConfig
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCopy(data.copy);
    } catch (error) {
      console.error('生成文案失败:', error);
      alert('生成文案失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getRequiredFields = (sceneId: string): string[] => {
    const requiredFieldsMap: Record<string, string[]> = {
      beauty: ['productName', 'brand', 'usageFeel', 'effect', 'recommendation'],
      fashion: ['clothingType', 'style', 'matchingTips', 'scenario', 'usageFeel'],
      travel: ['destination', 'duration', 'attractions', 'food', 'tips', 'experience'],
      food: ['restaurantName', 'location', 'cuisineType', 'signatureDishes', 'taste', 'recommendation'],
      home: ['productName', 'category', 'usageScenario', 'functionality', 'usageFeel', 'recommendation'],
      fitness: ['workoutType', 'benefits', 'experience', 'tips'],
      parenting: ['babyAge', 'topic', 'problem', 'solution', 'experience', 'tips'],
      tech: ['productName', 'brand', 'specs', 'performance', 'userExperience', 'pros', 'recommendation']
    };
    return requiredFieldsMap[sceneId] || [];
  };

  return (
    <main className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          小红书文案编辑Agent
        </h1>
        <p style={{ color: '#94a3b8' }}>智能生成八大场景优质文案</p>
      </header>

      {/* 场景选择 */}
      <SceneSelector
        selectedScene={selectedScene}
        onSelectScene={handleSceneSelect}
      />

      {/* 场景参数配置 */}
      <SceneConfig
        sceneId={selectedScene}
        onConfigChange={handleConfigChange}
      />

      {/* 生成按钮 */}
      {selectedScene && (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={generateCopy}
            disabled={loading}
            style={{
              padding: '1rem 3rem',
              backgroundColor: '#60a5fa',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              transition: 'background 0.2s',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? '生成中...' : '生成文案'}
          </button>
        </div>
      )}

      {/* 文案编辑 */}
      <CopyEditor
        initialContent={generatedCopy}
        onContentChange={handleCopyChange}
        loading={loading}
      />

      {/* 文案预览 */}
      <CopyPreview
        content={generatedCopy}
        sceneId={selectedScene}
      />
    </main>
  );
}
