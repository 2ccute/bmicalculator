// 文章数据集合，存储多篇健康相关的文章
const articles = [
    {
        title: "BMI指数的科学解读",
        excerpt: "了解BMI指数的计算原理及其在健康评估中的应用",
        content: "BMI是身体质量指数的简称，通过体重（kg）除以身高（m）的平方计算得出。该指数能初步反映人体胖瘦程度，但需结合体脂率、肌肉量等指标综合判断。正常范围（18.5-23.9）适用于大多数成年人，但运动员和孕妇等特殊人群需另行评估。\n\nWHO BMI分类标准：\n- 18.5以下：体重不足\n- 18.5-23.9：正常范围\n- 25.0-29.9：超重\n- 30.0及以上：肥胖\n\n局限性说明：\n1. 肌肉量影响：运动员可能被误判为超重\n2. 年龄差异：老年人理想BMI应上浮1-2个单位\n3. 种族差异：亚洲人群肥胖相关疾病风险在较低BMI时即升高\n4. 需结合腰围（男性≥90cm，女性≥85cm为腹型肥胖）",
        link: "#"
    },
    {
        title: "科学减重三要素",
        excerpt: "基于NEAT理论的体重管理方案",
        content: "1. 能量平衡：\n   - 建议每日500kcal热量缺口\n   - 减重速度0.5-1kg/周\n\n2. 营养构成：\n   - 蛋白质1.6-2.2g/kg体重（保留肌肉）\n   - 碳水供能比40-50%\n   - 脂肪20-30%（单不饱和脂肪酸为主）\n\n3. 运动处方：\n   - 每周300分钟中强度有氧\n   - 每周2次抗阻训练\n   - 日常NEAT消耗（非运动性活动产热）增加200-300kcal/日"
    },
    {
        title: "肥胖预防指南",
        excerpt: "如何通过生活方式干预预防肥胖？",
        content: "预防肥胖的关键在于建立健康习惯：\n- 控制精制糖和饱和脂肪摄入\n- 增加膳食纤维摄取\n- 减少久坐时间（每小时起身活动5分钟）\n- 培养抗阻训练习惯\n- 定期进行体成分分析",
        link: "#"
    },
    {
        title: "生酮饮食分析",
        excerpt: "了解新兴的饮食方式",
        content: "正在评估中",
        link: "#"
    },
    {
        title: "BMI与慢性病关系",
        excerpt: "解读体重指数与健康风险的关联",
        content: "研究表明：\n- BMI＞25时，糖尿病风险增加3倍\n- BMI＞27会显著提升心血管疾病发病率\n- 肥胖人群骨关节炎发生率提高50%\n- 合理减重5-10%可明显改善代谢指标",
        link: "#"
    },
    {
        title: "体脂率的重要性",
        excerpt: "为什么体脂率比体重更能反映健康状况？",
        content: "体脂率是身体脂肪占体重的百分比：\n- 男性健康范围：10-20%\n- 女性健康范围：18-28%\n测量方法包括：\n1. 生物电阻抗分析法\n2. 皮褶厚度测量\n3. DEXA扫描\n维持健康体脂率的关键是结合有氧运动和力量训练",
        link: "#"
    },
];

// BMI 计算核心模块
const BMICalculator = {

    /**
     * 计算BMI值
     * @param {number} height - 身高（厘米）
     * @param {number} weight - 体重（公斤）
     * @returns {string} 保留1位小数的BMI值字符串
     */
    calculate: (height, weight) => {
        // 单位转换：厘米 → 米
        const heightInMeters = height / 100;  
        // 计算BMI：体重除以身高的平方
        const bmiValue = weight / (heightInMeters * heightInMeters);
        // 格式化结果（保留1位小数）
        return bmiValue.toFixed(1);
    },

    /**
     * 根据BMI值获取体重分类
     * @param {number} bmi - BMI数值
     * @returns {string} 体重状态中文描述
     */
    getCategory: (bmi) => {
        // 使用阶梯判断实现分类逻辑
        if (bmi < 18.5) return '体重过轻';    // 营养不良风险
        if (bmi < 24) return '体重正常';      // 健康理想范围
        if (bmi < 28) return '超重';          // 需要关注体重
        return '肥胖';                        // 存在健康风险
    }
};

// 文章管理模块（待实现）
const ArticleManager = {
    render: () => {
        // 预留文章渲染功能
    }
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const calculateButton = document.getElementById('calculate');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const resultDiv = document.getElementById('result');

    // 绑定计算按钮点击事件
    calculateButton.addEventListener('click', calculateBMI);

    // 计算BMI的函数
    async function calculateBMI() {
        // 禁用输入框，防止重复计算
        heightInput.disabled = true;
        weightInput.disabled = true;

        // 获取输入值并转换为浮点数
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        // 输入验证
        if (isNaN(height) || isNaN(weight) || height < 0 || height > 300 || weight < 0 || weight > 350) {
            resultDiv.innerHTML = '请输入有效值：<br>身高(0-300cm) 体重(0-350kg)';
            calculateButton.innerHTML = '重试';
            calculateButton.classList.add('retry-btn');
            calculateButton.removeEventListener('click', calculateBMI);
            calculateButton.addEventListener('click', resetCalculator);
            return;
        }

        // 计算BMI并获取分类
        const roundedBMI = BMICalculator.calculate(height, weight);
        const category = BMICalculator.getCategory(roundedBMI);

        // 显示结果
        resultDiv.innerHTML = `您的 BMI 为 : ${roundedBMI} (${category})<div class="loading">生成建议中..</div>`;

        // 修改按钮状态
        calculateButton.innerHTML = '重试';
        calculateButton.classList.add('retry-btn');
        calculateButton.removeEventListener('click', calculateBMI);
        calculateButton.addEventListener('click', resetCalculator);
    }

    /**
     * 重置计算器到初始状态
     */
    function resetCalculator() {
        // 清空输入框内容
        heightInput.value = '';
        weightInput.value = '';
        
        // 恢复输入框交互
        heightInput.disabled = false;
        weightInput.disabled = false;
        
        // 清空结果显示区域
        resultDiv.innerHTML = '';
        
        // 重置按钮状态
        calculateButton.innerHTML = '计算 BMI';
        calculateButton.classList.remove('retry-btn');
        calculateButton.style.backgroundColor = '';
        
        // 切换事件监听器
        calculateButton.removeEventListener('click', resetCalculator);
        calculateButton.addEventListener('click', calculateBMI);
        
        // 重新渲染健康知识文章
        renderArticles();
        
        // 自动聚焦到身高输入框
        heightInput.focus();
    }

    /**
     * 渲染健康知识文章列表
     */
    function renderArticles() {
        // 获取文章容器DOM元素
        const container = document.getElementById('articles-container');
        
        // 生成文章卡片HTML
        container.innerHTML = articles.map(
            article => `
            <div class="article-card">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="#" class="read-more">更多</a>
                <div class="article-content" style="display:none;">
                    ${article.content.replace(/\n/g, '<br>')}
                </div>
            </div>
        `).join('');

        // 绑定文章交互事件
        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止链接默认跳转行为
                
                // 获取相邻的内容区块
                const content = this.nextElementSibling;
                
                // 切换显示状态
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                
                // 更新按钮文字
                this.textContent = isHidden ? '收起' : '更多';
            });
        });

        // 添加卡片悬停效果
        document.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
                card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            });
        });
    }
    
    // 初始化时渲染文章
    renderArticles();
});

// 文章详情交互
function showArticleDetail(content) {
    const detailDiv = document.getElementById('article-detail');
    detailDiv.innerHTML = `<div class="article-popup">
                            <div class="article-content">${content}</div>
                            <button class="close-btn">关闭</button>
                          </div>`;
    detailDiv.style.display = 'block';
    
    document.querySelector('.close-btn').addEventListener('click', hideArticleDetail);
}

function hideArticleDetail() {
    document.getElementById('article-detail').style.display = 'none';
}

// Markdown解析器
const marked = {
    parse: (md) => {
        const replacements = [
            // 保留空行转换段落
            [/(\n{2,})/g, '<br><br>'],
            [/#{2,}/g, (m) => `<h3>${m.replace(/#/g, '')}</h3>`],
            [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],
            // 改进列表匹配模式（保留列表项后的空行）
            [/(\d+\.\s[^\n]+)(\n+)(?=\d+\.|\s*<h3>|$)/gs, 
                (match, text, space) => `<ul><li>${text}</li></ul>${space.replace(/\n/g, '<br>')}`]
        ];
        
        return replacements.reduce((acc, [regex, repl]) => 
            acc.replace(regex, repl), md)
            // 最后处理剩余换行
            .replace(/\n/g, '<br>');
    }
};
