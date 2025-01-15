import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time
from urllib.parse import urljoin
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIProductScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.products = {}

    def scrape_futurepedia(self):
        """从Futurepedia抓取AI工具信息"""
        try:
            url = "https://www.futurepedia.io/ai-tools"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            tools = soup.find_all('div', class_='tool-card')
            for tool in tools:
                try:
                    name = tool.find('h3').text.strip()
                    description = tool.find('p').text.strip()
                    category = tool.find('span', class_='category').text.strip()
                    link = tool.find('a')['href']
                    
                    if category not in self.products:
                        self.products[category] = []
                    
                    self.products[category].append({
                        'name': name,
                        'description': description,
                        'url': link,
                        'icon': f"https://www.google.com/s2/favicons?domain={link}",
                        'source': 'Futurepedia'
                    })
                except Exception as e:
                    logger.error(f"Error processing tool: {e}")
                    continue
                
            logger.info(f"Successfully scraped {len(tools)} tools from Futurepedia")
        except Exception as e:
            logger.error(f"Error scraping Futurepedia: {e}")

    def scrape_alternativeto(self):
        """从AlternativeTo抓取AI工具信息"""
        try:
            url = "https://alternativeto.net/category/artificial-intelligence/"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            tools = soup.find_all('div', class_='app-item')
            for tool in tools:
                try:
                    name = tool.find('h2').text.strip()
                    description = tool.find('div', class_='description').text.strip()
                    category = "AI工具"  # AlternativeTo的默认分类
                    link = urljoin("https://alternativeto.net", tool.find('a')['href'])
                    
                    if category not in self.products:
                        self.products[category] = []
                    
                    self.products[category].append({
                        'name': name,
                        'description': description,
                        'url': link,
                        'icon': f"https://www.google.com/s2/favicons?domain={link}",
                        'source': 'AlternativeTo'
                    })
                except Exception as e:
                    logger.error(f"Error processing tool: {e}")
                    continue
                
            logger.info(f"Successfully scraped {len(tools)} tools from AlternativeTo")
        except Exception as e:
            logger.error(f"Error scraping AlternativeTo: {e}")

    def scrape_producthunt(self):
        """从ProductHunt抓取AI工具信息"""
        try:
            url = "https://www.producthunt.com/topics/artificial-intelligence"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            tools = soup.find_all('div', class_='styles_item__Dk_nz')
            for tool in tools:
                try:
                    name = tool.find('h3').text.strip()
                    description = tool.find('p').text.strip()
                    category = "AI产品"  # ProductHunt的默认分类
                    link = urljoin("https://www.producthunt.com", tool.find('a')['href'])
                    
                    if category not in self.products:
                        self.products[category] = []
                    
                    self.products[category].append({
                        'name': name,
                        'description': description,
                        'url': link,
                        'icon': f"https://www.google.com/s2/favicons?domain={link}",
                        'source': 'ProductHunt'
                    })
                except Exception as e:
                    logger.error(f"Error processing tool: {e}")
                    continue
                
            logger.info(f"Successfully scraped {len(tools)} tools from ProductHunt")
        except Exception as e:
            logger.error(f"Error scraping ProductHunt: {e}")

    def merge_categories(self):
        """合并和整理类别"""
        category_mapping = {
            'Image Generation': '图像生成',
            'Video Generation': '视频生成',
            'Audio Generation': '音频处理',
            'Text Generation': '文本生成',
            'Code Generation': '代码开发',
            'Chat': '聊天对话',
            'Translation': '翻译工具',
            'Writing': '写作助手',
            'Productivity': '效率工具',
            'Business': '商业应用',
            'Education': '教育工具',
            'Research': '研究工具'
        }
        
        merged_products = {}
        for category, items in self.products.items():
            mapped_category = category_mapping.get(category, category)
            if mapped_category not in merged_products:
                merged_products[mapped_category] = []
            merged_products[mapped_category].extend(items)
        
        return merged_products

    def scrape_products(self):
        """执行所有爬虫任务"""
        logger.info("开始爬取AI产品信息...")
        
        # 执行各个网站的爬虫
        self.scrape_futurepedia()
        time.sleep(2)  # 避免请求过快
        self.scrape_alternativeto()
        time.sleep(2)
        self.scrape_producthunt()
        
        # 合并和整理类别
        merged_products = self.merge_categories()
        
        # 如果在线爬取失败，使用备用数据
        if not merged_products:
            logger.warning("在线爬取失败，使用备用数据")
            return self._get_backup_data()
            
        logger.info(f"成功爬取了 {sum(len(items) for items in merged_products.values())} 个AI产品")
        return merged_products

    def _get_backup_data(self):
        """获取备用的预设数据"""
        return {
            "视频生成": [
                {
                    "name": "Runway",
                    "description": "AI视频生成和编辑工具",
                    "url": "https://runway.ml",
                    "icon": "https://runway.ml/favicon.ico"
                },
                # ... 其他预设数据 ...
            ],
            # ... 其他类别 ...
        }

    def save_to_json(self):
        """保存爬取的数据到JSON文件"""
        data = self.scrape_products()
        # 确保目录存在
        import os
        os.makedirs('public/data', exist_ok=True)
        
        output_file = 'public/data/ai_products.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"数据已保存到 {output_file}")

if __name__ == "__main__":
    scraper = AIProductScraper()
    scraper.save_to_json() 