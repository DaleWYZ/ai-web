'use client';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [products, setProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/ai_products.json')
      .then(res => {
        if (!res.ok) throw new Error('加载数据失败');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = Object.entries(products).reduce((acc, [category, items]) => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  // 获取数据源的标签颜色
  const getSourceColor = (source) => {
    const colors = {
      'Futurepedia': 'bg-blue-100 text-blue-800',
      'AlternativeTo': 'bg-green-100 text-green-800',
      'ProductHunt': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[source] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">AI产品导航</h1>
          <p className="mt-2 text-gray-600">发现和探索最新最全的AI产品和工具</p>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="搜索AI产品..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(filteredProducts).map(([category, items]) => (
            <div key={category} className="col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500">
                  <h2 className="text-xl font-semibold text-white">{category}</h2>
                  <div className="text-sm text-blue-100 mt-1">
                    {items.length} 个工具
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/placeholder-icon.png';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.name}
                            </h3>
                            {item.source && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(item.source)}`}>
                                {item.source}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500">
          <p>© 2024 AI产品导航. 数据来源：Futurepedia、AlternativeTo、ProductHunt</p>
        </div>
      </footer>
    </div>
  );
} 