// 密码保护功能
const ACCESS_PASSWORD = "HMharbourx2025$$";
const PASSWORD_STORAGE_KEY = "harbourx_access_token";
const PASSWORD_EXPIRY_HOURS = 24; // 24小时过期

// 检查localStorage中的密码是否有效
function checkStoredPassword() {
    try {
        const storedData = localStorage.getItem(PASSWORD_STORAGE_KEY);
        if (!storedData) return false;
        
        const { password, timestamp } = JSON.parse(storedData);
        const now = new Date().getTime();
        const expiryTime = timestamp + (PASSWORD_EXPIRY_HOURS * 60 * 60 * 1000);
        
        // 检查密码是否正确且未过期
        if (password === ACCESS_PASSWORD && now < expiryTime) {
            return true;
        } else {
            // 密码过期或错误，清除localStorage
            localStorage.removeItem(PASSWORD_STORAGE_KEY);
            return false;
        }
    } catch (e) {
        console.error('检查存储密码时出错:', e);
        localStorage.removeItem(PASSWORD_STORAGE_KEY);
        return false;
    }
}

// 保存密码到localStorage
function savePassword() {
    try {
        const passwordData = {
            password: ACCESS_PASSWORD,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(passwordData));
        console.log('密码已保存到localStorage，有效期24小时');
    } catch (e) {
        console.error('保存密码到localStorage时出错:', e);
    }
}

// 清除localStorage中的密码
function clearStoredPassword() {
    try {
        localStorage.removeItem(PASSWORD_STORAGE_KEY);
        console.log('已清除localStorage中的密码');
    } catch (e) {
        console.error('清除localStorage密码时出错:', e);
    }
}

function checkAccess() {
    const inputPassword = document.getElementById('passwordField').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (inputPassword === ACCESS_PASSWORD) {
        // 密码正确，保存到localStorage并隐藏覆盖层
        savePassword();
        document.getElementById('passwordProtection').style.display = 'none';
        // 确保滚动正常
        document.body.style.overflow = 'auto';
        
        // 显示成功消息
        errorDiv.textContent = '✅ 登录成功！密码已保存，24小时内无需重新输入';
        errorDiv.style.display = 'block';
        errorDiv.className = 'password-success';
        
        // 3秒后隐藏成功消息
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    } else {
        // 密码错误
        errorDiv.textContent = '❌ 密码错误，请重试';
        errorDiv.style.display = 'block';
        errorDiv.className = 'password-error';
        document.getElementById('passwordField').value = '';
        document.getElementById('passwordField').focus();
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 首先检查localStorage中是否有有效的密码
    if (checkStoredPassword()) {
        // 如果有有效密码，直接隐藏密码保护层
        document.getElementById('passwordProtection').style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('检测到有效密码，自动登录成功');
        
        // 显示欢迎消息
        showWelcomeMessage();
    } else {
        // 如果没有有效密码，显示密码输入界面
        console.log('需要输入密码或密码已过期');
        
        // 回车键支持
        document.getElementById('passwordField').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAccess();
            }
        });
        
        // 自动聚焦
        setTimeout(function() {
            document.getElementById('passwordField').focus();
        }, 100);
    }
    
    // 初始化Mermaid图表
    initializeMermaid();
});

// 初始化Mermaid图表
function initializeMermaid() {
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
}

// 显示欢迎消息
function showWelcomeMessage() {
    // 创建欢迎消息元素
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <div class="welcome-content">
            <h3>🎉 欢迎回来！</h3>
            <p>您已通过密码验证，可以正常访问HarbourX系统设计文档</p>
            <div class="welcome-actions">
                <button onclick="logout()" class="logout-btn">🔓 退出登录</button>
                <span class="expiry-info">密码有效期：24小时</span>
            </div>
        </div>
    `;
    
    // 插入到页面顶部
    const container = document.querySelector('.container');
    container.insertBefore(welcomeDiv, container.firstChild);
    
    // 5秒后自动隐藏欢迎消息
    setTimeout(() => {
        if (welcomeDiv.parentNode) {
            welcomeDiv.style.opacity = '0';
            setTimeout(() => {
                if (welcomeDiv.parentNode) {
                    welcomeDiv.parentNode.removeChild(welcomeDiv);
                }
            }, 500);
        }
    }, 5000);
}

// 退出登录功能
function logout() {
    clearStoredPassword();
    location.reload(); // 重新加载页面
}

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
        if (typeof mermaid !== 'undefined' && (tabName === 'feature-design' || tabName === 'uiux-design')) {
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


