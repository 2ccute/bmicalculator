/**
 * BMI计算核心模块，包含 计算逻辑 和 分类标准
 * 采用对象封装
 * 模块设计模式：使用立即执行
 */
const BMICalculator = {

    /**
     * 计算BMI值
     * @param {number} height - 身高（厘米）
     * @param {number} weight - 体重（公斤）
     * @returns {string} 保留1位小数的 BMI值字符串
     */

    /**
     * 计算BMI方法
     * @param {number} height - 身高（厘米），自动转换为 米 计算
     * @param {number} weight - 体重（公斤），需大于 0
     * @returns {string} 格式化以后 保留1位小数 的BMI值
     *
     * 步骤：
     * 1. 单位转换：厘米 → 米（除以100）
     * 2. 计算平方：身高（米）的平方
     * 3. BMI公式：体重 / 身高平方
     * 4. 结果格式化：四舍五入保留1位小数
     * 
     * 注意：JavaScript使用弱类型，需要显式转换数值类型
     */

    calculate: (height, weight) => {
        // 单位转换：厘米 → 米
        const heightInMeters = height / 100;
        // 计算平方，JavaScript中**运算符等同于Math.pow
        const heightSquared = heightInMeters ** 2;
        // BMI计算，不能除以零，但是当前调用已通过输入验证
        const bmiValue = weight / heightSquared;
        // 格式化结果，toFixed类似Java的DecimalFormat
        return bmiValue.toFixed(1);
    },

    /**
     * 获取不同BMI值分类
     * @param {number} bmi - BMI数值
     * @returns {string} 体重状态描述
     */

    /**
     * BMI分类方法（使用WHO标准）
     * @param {number} bmi - 得到的BMI数值
     * @returns {string} 对应的体重分类中文描述
     *
     * 分类标准说明：
     * - 过轻：<18.5（可能伴随营养不良风险）
     * - 正常：18.5-23.9（健康理想范围）
     * - 超重：24-27.9（需要关注体重）
     * - 肥胖：≥28（存在心血管疾病等风险）
     *
     * 注意：JavaScript中没有switch的区间判断，因此使用if阶梯判断更直观
     */

    getCategory: (bmi) => {
        // 第一条件：过轻范围
        if (bmi < 18.5) return '体重过轻';
        // 第二条件：正常范围（隐含bmi >=18.5）
        if (bmi < 24) return '体重正常';
        // 第三条件：超重范围（隐含bmi >=24）
        if (bmi < 28) return '超重';
        // 最终条件：肥胖（bmi >=28）
        return '肥胖';
    }

};


// 全局文章数据存储变量，用于保存从JSON文件加载的健康文章
let articles = [];


/**
 * 页面初始化入口（类比Java的main方法）
 * 使用DOMContentLoaded事件确保文档加载完成后执行
 * 包含异步操作需要使用async关键字
 */
document.addEventListener('DOMContentLoaded', async function() {

    // 加载文章数据：从JSON文件异步获取健康知识文章
    try {
        const response = await fetch('js/articles.json');
        articles = await response.json();
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles-container').innerHTML = '<p>文章加载失败，请稍后再试。</p>';
    }

    // 获取页面元素：获取DOM中的关键交互元素引用
    const calculateButton = document.getElementById('calculate');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const resultDiv = document.getElementById('result');

    // 绑定计算按钮点击事件：为计算按钮添加事件监听器
    calculateButton.addEventListener('click', calculateBMI);

    /**
     * 计算BMI的函数：处理用户输入、计算BMI、显示结果和获取AI建议
     * 包含输入验证、状态管理和异步操作
     */
    // 在calculateBMI函数中优化加载状态显示
    async function calculateBMI() {
    
        // 禁用输入框，防止重复计算：锁定UI元素避免重复提交
        heightInput.disabled = true;
        weightInput.disabled = true;
    
        // 获取输入值并转换为浮点数：从DOM元素获取用户输入并转换为数值类型
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
    
        // 输入验证：检查输入是否在合理范围内，不合理则显示错误信息
        if (isNaN(height) || isNaN(weight) || height < 0 || height > 300 || weight < 0 || weight > 350) {
            resultDiv.innerHTML = '请输入有效值：<br>身高(0-300cm) 体重(0-350kg)';
            calculateButton.innerHTML = '重试';
            calculateButton.classList.add('retry-btn');
            calculateButton.removeEventListener('click', calculateBMI);
            calculateButton.addEventListener('click', resetCalculator);
            return;
        }
    
        // 计算BMI并获取分类：调用BMICalculator对象的方法计算BMI值和对应分类
        const roundedBMI = BMICalculator.calculate(height, weight);
        const category = BMICalculator.getCategory(roundedBMI);
    
        // 显示结果和加载提示：更新DOM显示初步结果和加载状态
        resultDiv.innerHTML = `<div class="bmi-result">您的 BMI 为 : ${roundedBMI} (${category})</div>
                              <div class="loading" style="display:block;"><div class="loading-spinner"></div>正在获取高级智能建议…</div>`;
    
        // 获取AI建议：异步调用AI服务获取健康建议
        try {
            const aiAdvice = await getHealthAdvice(height, weight, roundedBMI);
            if (aiAdvice) {
                resultDiv.innerHTML = `<div class="bmi-result">您的 BMI 为 : ${roundedBMI} (${category})</div>
                                      
                                      <div class="ai-advice">${aiAdvice}</div>`;
            } else {
                resultDiv.innerHTML = `<div class="bmi-result">您的 BMI 为 : ${roundedBMI} (${category})</div>
                                      
                                      <div class="ai-advice">无法获取建议，请稍后再试。</div>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<div class="bmi-result">您的 BMI 为 : ${roundedBMI} (${category})</div>
                                  
                                  <div class="ai-advice">获取建议时出错，请稍后再试。</div>`;
        }

        // 修改按钮状态：更改按钮文本和事件处理，切换到重置模式
        calculateButton.innerHTML = '重试';
        calculateButton.classList.add('retry-btn');
        calculateButton.removeEventListener('click', calculateBMI);
        calculateButton.addEventListener('click', resetCalculator);
        
    }


    /**
     * 重置计算器为初始状态
     * 
     * 包含以下操作：
     * 1. 清空输入框
     * 2. 恢复UI交互
     * 3. 重置按钮样式和事件
     * 4. 重新渲染文章列表
     * 5. 焦点管理
     * 
     */

    function resetCalculator() {

        // 清空输入框内容：重置所有用户输入字段为空
        heightInput.value = '';
        weightInput.value = '';

        // 恢复输入框交互：解除输入框的禁用状态，允许用户再次输入
        heightInput.disabled = false;
        weightInput.disabled = false;

        // 清空结果显示区域：移除之前计算的结果和AI建议
        resultDiv.innerHTML = '';

        // 重置按钮原始状态：恢复按钮文本、样式和外观
        calculateButton.innerHTML = '计算 BMI';
        calculateButton.classList.remove('retry-btn');
        calculateButton.style.backgroundColor = '';

        // 事件监听器切换：移除重置事件，重新绑定计算事件
        calculateButton.removeEventListener('click', resetCalculator);
        calculateButton.addEventListener('click', calculateBMI);

        // 重新渲染文章：刷新健康知识文章列表
        renderArticles();

        // 自动聚焦到身高输入框：提升用户体验，方便再次输入
        heightInput.focus();

    }

    /**
     * 渲染健康知识文章列表
     * 将文章数据转换为HTML并添加交互效果
     */

    function renderArticles() {

        // 获取文章容器DOM元素：查找文章列表的容器元素
        const container = document.getElementById('articles-container');
        if (!container) return;

        // 生成文章卡片HTML：使用map方法将文章数组转换为HTML字符串
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

        // 绑定文章交互事件：为"更多"按钮添加点击事件，实现内容展开/收起功能
        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止链接默认跳转行为

                // 获取相邻的内容区块：找到当前按钮对应的文章内容元素
                const content = this.nextElementSibling;

                // 切换显示状态：根据当前状态切换显示/隐藏
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';

                // 更新按钮文字：根据显示状态更改按钮文本
                this.textContent = isHidden ? '收起' : '更多';
            });
        });

        // 添加卡片悬停效果：为文章卡片添加鼠标悬停动画效果
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

    // 初始化时渲染文章：页面加载完成后立即显示文章列表
    renderArticles();

});



/**
 * 显示文章详情弹窗
 * @param {string} content - 文章详细内容
 * 创建并显示一个包含文章内容的模态弹窗
 */
function showArticleDetail(content) {

    const detailDiv = document.getElementById('article-detail');
    detailDiv.innerHTML = `<div class="article-popup">
                            <div class="article-content">${content}</div>
                            <button class="close-btn">关闭</button>
                          </div>`;
    detailDiv.style.display = 'block';

    document.querySelector('.close-btn').addEventListener('click', hideArticleDetail);

}

/**
 * 隐藏文章详情弹窗
 * 关闭文章详情模态弹窗
 */
function hideArticleDetail() {
    document.getElementById('article-detail').style.display = 'none';
}

/**
 * 
 * 获取AI的体重建议
 * @param {number} height - 用户身高（厘米）
 * @param {number} weight - 用户体重（公斤）
 * @param {string} bmi - 计算得到的BMI值
 * @returns {Promise<string>} 格式化后的AI健康建议HTML
 * 
 * 通过API调用AI模型获取个性化健康建议
 * 
 */
async function getHealthAdvice(height, weight, bmi) {

    // 输入验证：确保身高和体重参数有效
    const resultDiv = document.getElementById('result');
    if (!height || !weight || height <= 0 || weight <= 0) {
        resultDiv.innerHTML = "请输入有效的身高（厘米）和体重（公斤）！";
        return;
    }

    // 从环境变量读取API信息：设置API端点和模型名称
    const apiUrl = 'https://bmiccl-cloud-1.vah03061.workers.dev/';
    const modelName = 'glm-4-flash';

    // 构建提示词：根据用户数据生成AI提示
    const prompt = `用户的身高是 ${height} 厘米，体重是 ${weight} 公斤，BMI 是 ${bmi}。
    请根据用户的身体状况，请提供这几项：全面分析、体重建议、饮食建议、运动建议、注意事项、总结。
    以一位顶尖的医学体重顾问对用户进行咨询的口吻回复，尽量多写字数。
    每一个要点之间要空一行，要轻重点分明`;

    try {
        // 发送API请求：调用AI服务获取健康建议
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    { role: 'system', content: '你是一位资深的医学体重顾问，提供科学健康的体重管理建议。' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 0,
            }),
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            // 获取AI的回复内容
            const content = data.choices[0].message.content;
            // 格式化AI回复内容
            return formatAIAdvice(content);
        } else {
            throw new Error('API 返回数据为空');
        }

    } catch (error) {
        console.error('API 调用失败:', error);
        throw error; // 抛出异常，交给上层处理
    }


}


/**
 * 格式化AI建议内容
 * @param {string} content - AI返回的原始内容（可能包含Markdown格式）
 * @returns {string} 格式化后的HTML内容，包含样式和结构
 */
function formatAIAdvice(content) {
    if (!content) return '';
    
    // 预处理：清理可能导致乱码的字符
    let formattedContent = content
        .replace(/[\ufeff\u200b]/g, '') // 移除零宽字符
        .replace(/\\n/g, '\n')          // 将转义的换行符转为实际换行符
        .replace(/\r\n/g, '\n')         // 统一换行符格式
        .replace(/\n{3,}/g, '\n\n');    // 减少过多的连续换行
    
    // HTML转义：防止XSS攻击
    formattedContent = formattedContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    // Markdown转HTML：处理各种Markdown格式
    
    // 1. 处理标题
    formattedContent = formattedContent.replace(/#{1,6}\s+(.*?)(?:\n|$)/g, '<h4>$1</h4>');
    
    // 2. 处理粗体文本
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 3. 处理列表项（改进的列表处理逻辑）
    let listItemPattern = /- (.*?)(?:\n|$)/g;
    let listMatches = formattedContent.match(listItemPattern);
    
    if (listMatches) {
        // 将所有列表项包装在一个<ul>中
        formattedContent = formattedContent.replace(listItemPattern, '<li>$1</li>');
        
        // 将连续的<li>元素组合成一个<ul>
        let ulPattern = /(<li>.*?<\/li>)+/g;
        formattedContent = formattedContent.replace(ulPattern, match => {
            return '<ul>' + match + '</ul>';
        });
    }
    
    // 4. 处理换行符（在非HTML标签内的换行转为<br>）
    formattedContent = formattedContent.replace(/\n(?![^<]*>)/g, '<br>');
    
    // 5. 为关键部分添加样式
    const sections = ['全面分析', '体重建议', '饮食建议', '运动建议', '注意事项', '总结'];
    sections.forEach(section => {
        formattedContent = formattedContent.replace(
            new RegExp(`(${section}[：:])`, 'g'), 
            `<div class="advice-section-title">${section}：</div>`
        );
    });
    
    // 6. 修复可能的HTML结构问题
    formattedContent = formattedContent
        .replace(/<\/ul><ul>/g, '')  // 合并相邻的ul标签
        .replace(/<br><ul>/g, '<ul>') // 移除ul前的br
        .replace(/<\/ul><br>/g, '</ul>'); // 移除ul后的br
    
    // 包装在一个容器中并返回
    return `<div class="ai-advice-container">${formattedContent}</div>`;
}

