'use client';
import { useRouter } from 'next/navigation';

interface AgentItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  route?: string;
}

export default function AgentHall() {
  const router = useRouter();

  // Agent数据，包含小红书agent作为第一个元素
  const agents: AgentItem[] = [
    {
      id: 'xiaohongshu',
      name: '小红书Agent',
      description: '智能生成小红书平台优质文案',
      icon: '📝',
      route: '/xiaohongshu'
    },
    {
      id: 'marketing',
      name: '营销Agent',
      description: '专业营销文案与策略生成',
      icon: '📈'
    },
    {
      id: 'research',
      name: '研究Agent',
      description: '深度调研与分析报告生成',
      icon: '🔍'
    },
    {
      id: 'travel',
      name: '旅行Agent',
      description: '旅行规划与攻略生成',
      icon: '✈️'
    },
    {
      id: 'hr',
      name: 'HR Agent',
      description: '人力资源管理与招聘',
      icon: '👥'
    },
    {
      id: 'media',
      name: '媒体Agent',
      description: '媒体内容与新闻稿生成',
      icon: '📺'
    },
    {
      id: 'ecommerce',
      name: '电商Agent',
      description: '电商运营与产品描述',
      icon: '🛒'
    },
    {
      id: 'social',
      name: '社交Agent',
      description: '社交媒体内容与互动',
      icon: '🌐'
    },
    {
      id: 'language',
      name: '语言Agent',
      description: '多语言翻译与内容优化',
      icon: '🌍'
    },
    {
      id: 'product',
      name: '产品Agent',
      description: '产品设计与用户研究',
      icon: '📱'
    }
  ];

  const handleAgentClick = (agent: AgentItem) => {
    if (agent.route) {
      // 直接导航，依赖布局文件的动画效果
      router.push(agent.route);
    } else {
      // 对于未实现的Agent，显示提示
      alert(`${agent.name} 正在开发中，敬请期待！`);
    }
  };

  return (
    <main className="container" style={{ alignItems: 'center' }}>
      {/* 页面标题 */}
      <header style={{ 
        marginBottom: '3rem', 
        textAlign: 'center',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 700, 
          backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa)', 
          WebkitBackgroundClip: 'text', 
          color: 'transparent',
          marginBottom: '1rem'
        }}>
          Agent大厅
        </h1>
        <p style={{ 
          color: '#94a3b8',
          fontSize: '1.1rem'
        }}>
          探索AI驱动的专业助手，赋能各类业务场景
        </p>
      </header>

      {/* Agent矩阵布局 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gridTemplateRows: 'repeat(6, auto)',
        gap: '1.5rem',
        maxWidth: '1400px',
        width: '100%',
        marginBottom: '3rem'
      }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => handleAgentClick(agent)}
            style={{
              background: 'var(--secondary)',
              border: agent.id === 'xiaohongshu' ? '2px solid #60a5fa' : '1px solid #334155',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: agent.id === 'xiaohongshu' ? '0 0 20px rgba(96, 165, 250, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = agent.id === 'xiaohongshu' 
                ? '0 10px 30px rgba(96, 165, 250, 0.4)' 
                : '0 5px 15px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = agent.id === 'xiaohongshu' 
                ? '0 0 20px rgba(96, 165, 250, 0.3)' 
                : 'none';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {agent.icon}
            </div>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: agent.id === 'xiaohongshu' ? '#60a5fa' : 'var(--foreground)'
            }}>
              {agent.name}
            </h3>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              {agent.description}
            </p>
            {agent.route && (
              <div style={{ 
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#60a5fa'
              }}>
                点击进入 →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 页脚 */}
      <footer style={{ 
        marginTop: '3rem', 
        textAlign: 'center', 
        color: '#64748b',
        fontSize: '0.9rem',
        width: '100%'
      }}>
        <p>© 2026 Agent系统 | 智能赋能未来</p>
      </footer>
    </main>
  );
}