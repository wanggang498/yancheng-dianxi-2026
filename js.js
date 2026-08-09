// 公共JS：登录注册、弹窗基础、登录状态管理（所有页面共用）
document.addEventListener('DOMContentLoaded', function() {
  // ********** 公共DOM元素获取（做判空，避免页面无元素时报错）**********
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const userInfo = document.getElementById('user-info');
  const usernameDisplay = document.getElementById('username-display');
  const logoutBtn = document.getElementById('logout-btn');
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const loginClose = document.getElementById('login-close');
  const registerClose = document.getElementById('register-close');
  const toRegister = document.getElementById('to-register');
  const toLogin = document.getElementById('to-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const registerTip = document.getElementById('register-tip');

  // ********** 本地存储初始化（用户数据持久化：所有页面共用）**********
  let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

  // ********** 页面加载时检查登录状态（所有页面共用）**********
  const loggedUser = localStorage.getItem('loggedUser');
  if (loggedUser && loginBtn && registerBtn && userInfo) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    usernameDisplay.textContent = `欢迎，${loggedUser}`;
  }

  // ********** 登录/注册弹窗打开（所有页面共用）**********
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'flex';
    });
  }
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      registerModal.style.display = 'flex';
      registerTip && (registerTip.style.display = 'none');
    });
  }

  // ********** 登录/注册弹窗关闭（所有页面共用）**********
  if (loginClose) {
    loginClose.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });
  }
  if (registerClose) {
    registerClose.addEventListener('click', () => {
      registerModal.style.display = 'none';
    });
  }

  // ********** 登录/注册弹窗切换（所有页面共用）**********
  if (toRegister) {
    toRegister.addEventListener('click', () => {
      loginModal.style.display = 'none';
      registerModal.style.display = 'flex';
      registerTip && (registerTip.style.display = 'none');
    });
  }
  if (toLogin) {
    toLogin.addEventListener('click', () => {
      registerModal.style.display = 'none';
      loginModal.style.display = 'flex';
    });
  }

  // ********** 注册核心逻辑（精准去重：所有页面共用）**********
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username')?.value;
      const phone = document.getElementById('register-phone')?.value;
      const pwd = document.getElementById('register-pwd')?.value;
      if (!username || !phone || !pwd) return;

      // 查找重复用户
      const matchedUser = registeredUsers.find(user => {
        return user.username === username || user.phone === phone;
      });

      if (matchedUser) {
        if (matchedUser.username === username && matchedUser.phone === phone) {
          registerTip.textContent = '该用户已存在';
        } else if (matchedUser.phone === phone) {
          registerTip.textContent = '该号码已注册账户';
        } else if (matchedUser.username === username) {
          registerTip.textContent = '用户名已存在';
        }
        registerTip.style.display = 'block';
        return;
      }

      // 注册成功：保存用户+持久化
      const newUser = { username, phone, pwd };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      registerTip.style.display = 'none';
      alert('注册成功！即将为您跳转到登录页面');

      // 跳转到登录弹窗
      setTimeout(() => {
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
        document.getElementById('login-account') && (document.getElementById('login-account').value = username);
      }, 1500);
    });
  }

  // ********** 登录核心逻辑（账号/手机号均可登录：所有页面共用）**********
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const account = document.getElementById('login-account')?.value;
      const pwd = document.getElementById('login-pwd')?.value;
      if (!account || !pwd) return;

      // 匹配用户
      const user = registeredUsers.find(
        u => (u.username === account || u.phone === account) && u.pwd === pwd
      );

      if (user) {
        loginModal.style.display = 'none';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        usernameDisplay.textContent = `欢迎，${user.username}`;
        localStorage.setItem('loggedUser', user.username);
        // 新增：登录成功时记录"临时登录状态"，用于换页保持
        sessionStorage.setItem('tempLoggedUser', user.username);
      } else {
        alert('账号或密码错误');
      }
    });
  }

  // ********** 退出登录逻辑（所有页面共用）**********
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedUser');
      sessionStorage.removeItem('tempLoggedUser'); // 退出时清空临时状态
      loginBtn.style.display = 'block';
      registerBtn.style.display = 'block';
      userInfo.style.display = 'none';
      alert('已成功退出登录');
    });
  }

  // ********** 点击弹窗外部关闭（公共弹窗+登录注册弹窗：所有页面共用）**********
  window.addEventListener('click', (e) => {
    // 关闭登录/注册弹窗
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    // 关闭通用modal弹窗
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // ********** 阻止弹窗内容点击触发外部关闭（所有页面共用）**********
  const allModalContents = document.querySelectorAll('.modal-content, .auth-modal-content');
  allModalContents.forEach(content => {
    content.addEventListener('click', (e) => e.stopPropagation());
  });

  // ********** 修复：仅页面关闭/刷新清除登录状态，换页保留（所有页面共用）**********
  // 1. 页面加载时，优先读取sessionStorage的临时登录状态（换页保留）
  const tempLoggedUser = sessionStorage.getItem('tempLoggedUser');
  if (tempLoggedUser && !loggedUser && loginBtn && registerBtn && userInfo) {
    localStorage.setItem('loggedUser', tempLoggedUser);
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    usernameDisplay.textContent = `欢迎，${tempLoggedUser}`;
  }

  // 2. 仅在页面真正关闭/刷新时清除（通过判断是否是换页）
  let isNavigating = false;
  // 监听页面内跳转（a标签），标记为“换页”，不清除登录
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.href && target.host === window.location.host) {
      isNavigating = true;
    }
  });
  // 监听浏览器前进/后退，标记为“换页”
  window.addEventListener('popstate', () => {
    isNavigating = true;
  });

  // 页面关闭/刷新时，仅非换页场景清除登录
  window.addEventListener('beforeunload', () => {
    if (!isNavigating) {
      localStorage.removeItem('loggedUser');
      sessionStorage.removeItem('tempLoggedUser');
    }
  });
});

// ==================== 以下是新增的3D模型加载代码（完全独立，不影响任何登录注册功能）====================
// 使用 setTimeout 确保在登录注册代码之后执行
setTimeout(function() {
  // 检查当前页面是否有模型视图
  const modelView = document.getElementById('model-view');
  const placeholder = document.getElementById('model-placeholder');
  
  // 如果页面没有模型视图，就不初始化
  if (!modelView || !placeholder) return;

  // 确保Three.js已加载
  if (typeof THREE === 'undefined') {
    console.error('Three.js未加载');
    placeholder.innerHTML = '<p>3D库加载失败</p>';
    return;
  }

  // 获取容器尺寸
  const width = modelView.clientWidth;
  const height = modelView.clientHeight;
  
  // 创建场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f5f0);
  
  // 创建相机
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(5, 3, 8);
  camera.lookAt(0, 1.5, 0);
  
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xf8f5f0);
  renderer.shadowMap.enabled = true;
  
  // 清空并添加canvas
  const existingCanvas = modelView.querySelector('canvas');
  if (existingCanvas) existingCanvas.remove();
  
  modelView.appendChild(renderer.domElement);
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  // 加载模型
  const loader = new THREE.GLTFLoader();
  // 使用相对路径，适配本地服务器
  const modelUrl = 'images/Hitem3d-1s.glb';
  
  placeholder.innerHTML = '<p>正在加载3D模型...</p>';
  
  loader.load(
    modelUrl,
    function(gltf) {
      const model = gltf.scene;
      
      // 计算包围盒并调整位置
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // 自动缩放
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      model.scale.set(scale, scale, scale);
      
      model.position.set(-center.x * scale, -center.y * scale + 1.5, -center.z * scale);
      
      scene.add(model);
      
      // 隐藏占位符
      placeholder.style.display = 'none';
      
      // 保存模型引用
      window.gltfModel = model;
      
      // 交互控制
      let isDragging = false;
      let lastX = 0, lastY = 0;
      
      modelView.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        modelView.style.cursor = 'grabbing';
      });
      
      window.addEventListener('mousemove', (e) => {
        if (!isDragging || !window.gltfModel) return;
        
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        
        window.gltfModel.rotation.y += deltaX * 0.01;
        window.gltfModel.rotation.x += deltaY * 0.01;
        window.gltfModel.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, window.gltfModel.rotation.x));
        
        lastX = e.clientX;
        lastY = e.clientY;
      });
      
      window.addEventListener('mouseup', () => {
        isDragging = false;
        modelView.style.cursor = 'grab';
      });
      
      // 滚轮缩放
      modelView.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!window.gltfModel) return;
        
        const scale = window.gltfModel.scale.x;
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(0.3, Math.min(5, scale + delta));
        window.gltfModel.scale.set(newScale, newScale, newScale);
      });
      
      // 视角切换
      document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (!window.gltfModel) return;
          
          switch(this.textContent) {
            case '正面':
              window.gltfModel.rotation.set(0, 0, 0);
              break;
            case '侧面':
              window.gltfModel.rotation.set(0, Math.PI/2, 0);
              break;
            case '俯视':
              window.gltfModel.rotation.set(Math.PI/4, 0, 0);
              break;
            case '仰视':
              window.gltfModel.rotation.set(-Math.PI/4, 0, 0);
              break;
          }
        });
      });
      
      // 动画循环
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      
      animate();
      
      // 窗口大小调整
      window.addEventListener('resize', () => {
        const newWidth = modelView.clientWidth;
        const newHeight = modelView.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      });
    },
    function(xhr) {
      // 进度显示
      if (xhr.lengthComputable) {
        const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
        placeholder.innerHTML = `<p>加载中... ${percent}%</p>`;
      }
    },
    function(error) {
      placeholder.innerHTML = '<p>❌ 无法连接到本地服务器</p><p style="color:#E67E22;font-size:0.9rem;">请双击「启动.cmd」文件</p>';
      console.error('加载失败:', error);
    }
  );
}, 500); // 延迟500ms执行，确保不影响登录注册
