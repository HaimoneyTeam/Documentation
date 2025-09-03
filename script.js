// 密码保护功能
const ACCESS_PASSWORD = "HMharbourx2025$$";

function checkAccess() {
    const inputPassword = document.getElementById('passwordField').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (inputPassword === ACCESS_PASSWORD) {
        // 密码正确，隐藏覆盖层
        document.getElementById('passwordProtection').style.display = 'none';
        // 确保滚动正常
        document.body.style.overflow = 'auto';
    } else {
        // 密码错误
        errorDiv.textContent = '❌ 密码错误，请重试';
        errorDiv.style.display = 'block';
        document.getElementById('passwordField').value = '';
        document.getElementById('passwordField').focus();
    }
}

// 回车键支持
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('passwordField').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAccess();
        }
    });
    
    // 自动聚焦
    setTimeout(function() {
        document.getElementById('passwordField').focus();
    }, 100);
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    
    // 重新渲染Mermaid图表当tab变为可见时
    setTimeout(function() {
        if (typeof mermaid !== 'undefined' && tabName === 'feature-design') {
            try {
                // 获取新激活tab中的所有mermaid元素
                const activeTabElement = document.getElementById(tabName);
                const mermaidElements = activeTabElement.querySelectorAll('.mermaid');
                
                mermaidElements.forEach(function(element) {
                    // 检查是否已经渲染过
                    if (element.getAttribute('data-processed') === 'true') {
                        // 清除之前的渲染结果
                        element.removeAttribute('data-processed');
                        // 恢复原始文本内容
                        const originalText = element.getAttribute('data-original-text');
                        if (originalText) {
                            element.innerHTML = originalText;
                        } else {
                            // 如果没有保存原始文本，使用当前textContent
                            const textContent = element.textContent || element.innerText;
                            element.innerHTML = textContent;
                        }
                    } else {
                        // 第一次渲染，保存原始文本
                        const originalText = element.textContent || element.innerText;
                        element.setAttribute('data-original-text', originalText);
                    }
                });
                
                // 重新初始化mermaid图表
                if (mermaidElements.length > 0) {
                    mermaid.init(undefined, mermaidElements);
                    console.log('Mermaid图表重新渲染完成，共' + mermaidElements.length + '个图表');
                }
            } catch (e) {
                console.error('Mermaid重新渲染失败:', e);
            }
        }
    }, 200);
}

mermaid.initialize({ 
    startOnLoad: false,
    theme: 'default',
    flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 80
    },
    er: {
        layoutDirection: 'TB',
        minEntityWidth: 100,
        minEntityHeight: 75,
        entityPadding: 15,
        stroke: '#333',
        fill: '#fff'
    },
    themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#5a67d8',
        lineColor: '#333',
        sectionBkgColor: '#f7fafc',
        altSectionBkgColor: '#edf2f7',
        gridColor: '#e2e8f0',
        cScale0: '#667eea',
        cScale1: '#764ba2',
        cScale2: '#3498db'
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('HarbourX 系统设计文档已加载完成');
    
    // 确保所有Mermaid图表都能正确渲染
    setTimeout(function() {
        if (typeof mermaid !== 'undefined') {
            try {
                // 只渲染当前可见tab中的图表
                const activeTab = document.querySelector('.tab-content.active');
                if (activeTab) {
                    const mermaidElements = activeTab.querySelectorAll('.mermaid');
                    if (mermaidElements.length > 0) {
                        // 为初始加载的图表保存原始文本
                        mermaidElements.forEach(function(element) {
                            const originalText = element.textContent || element.innerText;
                            element.setAttribute('data-original-text', originalText);
                        });
                        
                        mermaid.init(undefined, mermaidElements);
                        console.log('当前可见Mermaid图表初始化完成，共' + mermaidElements.length + '个图表');
                    }
                }
            } catch (e) {
                console.error('Mermaid初始化失败:', e);
            }
        }
    }, 300);
});
