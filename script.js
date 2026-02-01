// 全局变量
let map;// 用户位置（中国福利会少年宫）
let userLocation = [31.2284, 121.4457]; // 上海市中国福利会少年宫（静安区延安西路64号）
// 上海真实标志性地点数据（包含别名和关键词）
const locations = [
    { name: "中国福利会少年宫", address: "静安区延安西路64号", coords: [31.2284, 121.4457], aliases: ["少年宫", "三和花园", "延安西路少年宫", "中福会少年宫"] },
    { name: "瑞金医院", address: "黄浦区瑞金二路197号", coords: [31.2159, 121.4737], aliases: ["瑞金医院", "上海瑞金医院", "瑞金二路医院"] },
    { name: "华山医院", address: "静安区乌鲁木齐中路12号", coords: [31.2259, 121.4457], aliases: ["华山医院", "乌鲁木齐中路医院", "静安华山医院"] },
    { name: "中山医院", address: "徐汇区枫林路180号", coords: [31.1959, 121.4637], aliases: ["中山医院", "枫林路医院", "徐汇中山医院"] },
    { name: "南京路步行街", address: "黄浦区南京东路", coords: [31.2359, 121.4847], aliases: ["南京路", "南京东路", "步行街", "南京路步行街"] },
    { name: "徐家汇商圈", address: "徐汇区漕溪北路", coords: [31.1959, 121.4367], aliases: ["徐家汇", "漕溪北路商圈", "徐汇商圈"] },
    { name: "静安寺商圈", address: "静安区南京西路", coords: [31.2259, 121.4457], aliases: ["静安寺", "南京西路商圈", "静安商圈"] },
    { name: "外滩", address: "黄浦区中山东一路", coords: [31.2459, 121.4887], aliases: ["外滩", "上海外滩", "中山东一路"] },
    { name: "豫园", address: "黄浦区安仁街218号", coords: [31.2259, 121.4937], aliases: ["豫园", "上海豫园", "安仁街豫园"] },
    { name: "上海博物馆", address: "黄浦区人民大道201号", coords: [31.2359, 121.4747], aliases: ["上海博物馆", "人民大道博物馆", "上海博"] },
    { name: "上海科技馆", address: "浦东新区世纪大道2000号", coords: [31.2159, 121.5467], aliases: ["上海科技馆", "世纪大道科技馆", "浦东科技馆"] },
    { name: "上海站", address: "静安区秣陵路303号", coords: [31.2559, 121.4567], aliases: ["上海站", "上海火车站", "秣陵路火车站", "上海站北广场"] },
    { name: "上海虹桥站", address: "闵行区申贵路1500号", coords: [31.1959, 121.3217], aliases: ["虹桥站", "上海虹桥站", "虹桥火车站", "申贵路火车站"] },
    { name: "虹桥机场", address: "闵行区申达一路", coords: [31.1979, 121.3367], aliases: ["虹桥机场", "上海虹桥机场", "虹桥T1", "虹桥一号航站楼"] },
    { name: "浦东机场", address: "浦东新区启航路300号", coords: [31.1443, 121.8083], aliases: ["浦东机场", "上海浦东机场", "浦东国际机场", "启航路机场"] }
];
let currentRoute = null;
let routes = [];

// 虚拟城市数据
const virtualCity = {
    name: "幸福城",
    locations: {
        "幸福小区": [39.9042, 116.4074],
        "中心医院": [39.9142, 116.4274],
        "老年活动中心": [39.8942, 116.3974],
        "菜市场": [39.9242, 116.4174],
        "公园": [39.8842, 116.4274],
        "银行": [39.9142, 116.3974],
        "超市": [39.9042, 116.4374],
        "图书馆": [39.8942, 116.4174],
        "社区服务中心": [39.9242, 116.4074]
    },
    busStops: [
        { name: "幸福小区站", coords: [39.9042, 116.4074] },
        { name: "中心医院站", coords: [39.9142, 116.4274] },
        { name: "老年活动中心站", coords: [39.8942, 116.3974] },
        { name: "菜市场站", coords: [39.9242, 116.4174] },
        { name: "公园站", coords: [39.8842, 116.4274] }
    ],
    subwayStations: [
        { name: "幸福站", coords: [39.9042, 116.4074] },
        { name: "医院站", coords: [39.9142, 116.4274] },
        { name: "公园站", coords: [39.8842, 116.4274] }
    ]
};

// 初始化地图 - 全局函数
window.initMap = function() {
    try {
        // 初始化上海市地图
        map = L.map('map').setView(userLocation, 13);
        
                // 使用高德地图（国内免费，加载快）
        try {
            L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
                subdomains: '1234',
                attribution: '© 高德地图',
                maxZoom: 18,
                minZoom: 10
            }).addTo(map);
            
            document.getElementById('mapLoading').style.display = 'none';
            console.log('高德地图加载成功');
        } catch (error) {
            console.log('地图加载失败：', error);
            showOfflineMap();
        }
        
        // 添加用户位置标记
        const userMarker = L.marker(userLocation)
            .addTo(map)
            .bindPopup("<b>📍 您的位置</b><br>中国福利会少年宫")
            .openPopup();
        
        // 添加所有地点标记
        addLocationMarkers();
        
        // 添加交通站点
        addTransportStations();
        
    } catch (error) {
        console.error('地图初始化失败:', error);
        showOfflineMap();
    }
}

// 显示离线地图方案 - 全局函数
window.showOfflineMap = function() {
    document.getElementById('map').style.background = 'linear-gradient(135deg, #e8f4f8 0%, #d4e6f1 100%)';
    document.getElementById('mapLoading').innerHTML = '<div style="padding: 20px; text-align: center; color: #2c3e50;"><h3>🗺️ 上海市地图</h3><p style="color: #e74c3c; margin: 10px 0;">⚠️ 网络连接异常</p><p>正在使用离线地图模式</p><div style="margin: 15px 0; font-size: 16px;"><p>🏠 您的位置：中国福利会少年宫</p><p>📍 可前往：医院、公园、超市等地点</p></div><button onclick="retryLoadMap()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">重新加载地图</button></div>';
}

// 添加地点标记
function addLocationMarkers() {
    locations.forEach(location => {
        const marker = L.marker(location.coords)
            .addTo(map)
            .bindPopup('<b>' + location.name + '</b><br>' + location.address);
    });
}

// 更新datalist的实时建议
function updateDatalist(suggestions) {
    const datalist = document.getElementById('popularDestinations');
    datalist.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
}

// 添加公交站和地铁站
function addTransportStations() {
    // 上海主要地铁站（红色圆圈）
    const subwayStations = [
        {name: "人民广场站", coords: [31.2359, 121.4747]},
        {name: "南京东路站", coords: [31.2359, 121.4847]},
        {name: "静安寺站", coords: [31.2259, 121.4457]},
        {name: "徐家汇站", coords: [31.1959, 121.4367]},
        {name: "陆家嘴站", coords: [31.2459, 121.4987]},
        {name: "虹桥路站", coords: [31.2059, 121.4117]},
        {name: "世纪大道站", coords: [31.2259, 121.5267]},
        {name: "上海火车站", coords: [31.2559, 121.4567]}
    ];
    
    // 上海主要公交站（蓝色圆圈）
    const busStations = [
        {name: "外滩公交站", coords: [31.2459, 121.4887]},
        {name: "豫园公交站", coords: [31.2259, 121.4937]},
        {name: "瑞金医院公交站", coords: [31.2159, 121.4737]},
        {name: "华山医院公交站", coords: [31.2259, 121.4457]},
        {name: "中山医院公交站", coords: [31.1959, 121.4637]},
        {name: "虹桥机场公交站", coords: [31.1979, 121.3367]},
        {name: "浦东机场公交站", coords: [31.1443, 121.8083]},
        {name: "上海南站公交站", coords: [31.1559, 121.4317]}
    ];
    
    // 添加地铁站标记
    subwayStations.forEach(station => {
        const marker = L.circleMarker(station.coords, {
            radius: 8,
            color: '#dc3545',
            fillColor: '#dc3545',
            fillOpacity: 0.7
        }).addTo(map).bindPopup('<b>地铁 ' + station.name + '</b>');
    });
    
    // 添加公交站标记
    busStations.forEach(station => {
        const marker = L.circleMarker(station.coords, {
            radius: 8,
            color: '#007bff',
            fillColor: '#007bff',
            fillOpacity: 0.7
        }).addTo(map).bindPopup('<b>公交 ' + station.name + '</b>');
    });
}

// 增强的模糊搜索功能（支持别名匹配）
function fuzzySearch(searchTerm, locations) {
    const term = searchTerm.toLowerCase().trim();
    
    // 如果精确匹配，直接返回
    const exactMatch = locations.find(loc => loc.name === searchTerm);
    if (exactMatch) return exactMatch;
    
    // 检查别名匹配
    const aliasMatch = locations.find(loc => 
        loc.aliases && loc.aliases.some(alias => alias.toLowerCase().includes(term))
    );
    if (aliasMatch) return aliasMatch;
    
    // 模糊匹配算法
    const results = locations.filter(loc => {
        const name = loc.name.toLowerCase();
        const address = loc.address.toLowerCase();
        const allTexts = [name, address, ...(loc.aliases || []).map(a => a.toLowerCase())];
        
        // 完全包含匹配
        for (let text of allTexts) {
            if (text.includes(term)) return true;
        }
        
        // 关键词匹配
        const keywords = term.split('');
        
        // 检查每个字符是否都出现在名称中
        for (let text of allTexts) {
            const allCharsMatch = keywords.every(char => text.includes(char));
            if (allCharsMatch) return true;
        }
        
        // 部分匹配
        for (let text of allTexts) {
            let matchCount = 0;
            keywords.forEach(char => {
                if (text.includes(char)) matchCount++;
            });
            
            // 如果匹配度超过50%，认为匹配成功
            if (matchCount >= keywords.length * 0.5) return true;
        }
        
        return false;
    });
    
    // 返回最佳匹配结果
    return results.length > 0 ? results[0] : null;
}

// 搜索路线（增强版）
function searchRoute() {
    const searchInput = document.getElementById('endLocation');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        alert('请输入目的地！');
        return;
    }
    
    // 使用模糊搜索
    const destination = fuzzySearch(searchTerm, locations);
    
    if (!destination) {
        // 提供智能建议
        const suggestions = getSearchSuggestions(searchTerm);
        let message = '找不到"' + searchTerm + '"，可能是：\n';
        suggestions.forEach(suggestion => {
            message += '- ' + suggestion + '\n';
        });
        alert(message);
        return;
    }
    
    // 如果找到了匹配但名称不完全相同，提示用户
    if (destination.name !== searchTerm) {
        const confirmed = confirm('您是想搜索"' + destination.name + '"吗？');
        if (!confirmed) return;
    }
    
    // 更新输入框为准确名称
    searchInput.value = destination.name;
    
    // 生成路线选项
    routes = generateRoutes(userLocation, destination.coords, destination.name);
    
    // 显示路线选项
    displayRoutes();
    
    // 绘制路线
    drawRoutesOnMap();
    
    // 显示路线选择区域
    document.getElementById('routeSection').style.display = 'block';
}

// 生成路线
function generateRoutes(start, end, destinationName) {
    const distance = calculateDistance(start, end);
    const baseTime = distance * 5; // 基础时间（分钟）
    
    // 根据目的地智能推荐具体路线
    const routeDetails = getRouteDetails(start, end, destinationName);
    
    // 骑行距离提醒
    let cyclingWarning = "适合短途出行，注意安全";
    if (distance > 3) {
        cyclingWarning = "⚠️ 距离较远，建议考虑其他交通方式";
    } else if (distance > 1.5) {
        cyclingWarning = "⚠️ 距离较长，请量力而行";
    }
    
    return [
        {
            type: '公交',
            icon: '🚌',
            price: Math.round(distance * 2),
            time: Math.round(baseTime * 1.8),
            description: '乘坐' + Math.ceil(distance/3) + '站公交到达' + destinationName,
            transfers: Math.ceil(distance/5),
            route: generateBusRoute(start, end),
            tips: routeDetails.bus || '最省钱但需要换乘'
        },
        {
            type: '地铁',
            icon: '🚇',
            price: Math.round(distance * 3.5),
            time: Math.round(baseTime * 0.8),
            description: '乘坐地铁' + (routeDetails.metro || '直达') + destinationName,
            transfers: 0,
            route: generateSubwayRoute(start, end),
            tips: routeDetails.metro || '快速准时'
        },
        {
            type: '打车',
            icon: '🚗',
            price: Math.round(distance * 12),
            time: Math.round(baseTime * 0.6),
            description: '打车直达' + destinationName,
            transfers: 0,
            route: [start, end],
            tips: '最方便快捷'
        },
        {
            type: '步行',
            icon: '🚶',
            price: 0,
            time: Math.round(distance * 12),
            description: '步行' + Math.round(distance * 1000) + '米到达' + destinationName,
            transfers: 0,
            route: [start, end],
            tips: distance > 1 ? "距离较长，请穿舒适的鞋子" : "适合锻炼身体"
        },
        {
            type: '骑行',
            icon: '🚲',
            price: 1,
            time: Math.round(distance * 4),
            description: '骑行' + Math.round(distance * 1000) + '米到达' + destinationName,
            transfers: 0,
            route: [start, end],
            tips: cyclingWarning
        }
    ];
}

// 生成公交换乘步骤
function generateBusSteps(busRoute, endName) {
    if (!busRoute) return '<p>乘坐多辆公交车，注意听报站</p>';
    
    const steps = [];
    const parts = busRoute.split('→');
    
    for (let i = 0; i < parts.length; i++) {
        if (i === 0) {
            steps.push('<div style="margin:5px 0;"><strong>第1步：</strong>从<strong>中国福利会少年宫</strong>乘坐' + parts[i].replace('乘坐', '') + '</div>');
        } else if (i === parts.length - 1) {
            steps.push('<div style="margin:5px 0;"><strong>第' + (i+1) + '步：</strong>在' + parts[i] + '下车，到达<strong>' + endName + '</strong></div>');
        } else {
            steps.push('<div style="margin:5px 0;"><strong>第' + (i+1) + '步：</strong>在' + parts[i] + '换乘</div>');
        }
    }
    
    return steps.join('');
}

// 生成地铁换乘步骤
function generateMetroSteps(metroRoute, endName) {
    if (!metroRoute) return '<p>乘坐地铁，注意听报站</p>';
    
    const steps = [];
    const parts = metroRoute.split('→');
    
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes('号线')) {
            if (i === 0) {
                steps.push('<div style="margin:5px 0;"><strong>第1步：</strong>从<strong>中国福利会少年宫</strong>步行到地铁站，乘坐' + parts[i] + '</div>');
            } else if (i === parts.length - 1) {
                steps.push('<div style="margin:5px 0;"><strong>第' + (i+1) + '步：</strong>在' + parts[i] + '下车，到达<strong>' + endName + '</strong></div>');
            } else {
                steps.push('<div style="margin:5px 0;"><strong>第' + (i+1) + '步：</strong>在' + parts[i] + '换乘</div>');
            }
        } else {
            steps.push('<div style="margin:5px 0;"><strong>第' + (i+1) + '步：</strong>在' + parts[i] + '换乘</div>');
        }
    }
    
    return steps.join('');
}

// 生成步行步骤
function generateWalkSteps(walkRoute, endName) {
    if (!walkRoute || walkRoute.includes("不建议")) {
        return '<div style="margin:5px 0;color:#e74c3c;"><strong>注意：</strong>距离较远，建议选择其他交通方式</div>';
    }
    
    return '<div style="margin:5px 0;"><strong>步行路线：</strong>' + walkRoute + '</div><div style="margin:5px 0;"><strong>终点：</strong>' + endName + '</div>';
}

// 生成骑行步骤
function generateBikeSteps(bikeRoute, endName) {
    if (!bikeRoute || bikeRoute.includes("不建议")) {
        return '<div style="margin:5px 0;color:#e74c3c;"><strong>注意：</strong>距离过远，不建议骑行</div>';
    }
    
    return '<div style="margin:5px 0;"><strong>骑行路线：</strong>' + bikeRoute + '</div><div style="margin:5px 0;"><strong>终点：</strong>' + endName + '</div>';
}

// 根据目的地智能推荐具体路线
 function getRouteDetails(start, end, destinationName) {
     const routes = {
         "🏛️ 中国福利会少年宫": {
             bus: "乘坐71路→15路，在延安西路站下车",
             metro: "地铁2号线→静安寺站换乘7号线→少年宫站",
             walk: "沿延安西路向东步行约800米",
             bike: "沿延安西路骑行约800米，注意交通安全"
         },
         "🏥 瑞金医院": {
             bus: "乘坐104路直达，瑞金医院站下车",
             metro: "地铁1号线→陕西南路站换乘10号线→瑞金医院站",
             walk: "沿瑞金二路向南步行约1.2公里",
             bike: "沿瑞金二路骑行约1.2公里，注意医院周边车流"
         },
         "🏥 华山医院": {
             bus: "乘坐93路→乌鲁木齐中路站下车",
             metro: "地铁7号线→静安寺站→步行5分钟",
             walk: "沿乌鲁木齐中路向北步行约600米",
             bike: "沿乌鲁木齐中路骑行约600米"
         },
         "🏥 中山医院": {
             bus: "乘坐49路→枫林路站下车",
             metro: "地铁9号线→肇嘉浜路站换乘7号线→中山医院站",
             walk: "沿枫林路向南步行约1公里",
             bike: "沿枫林路骑行约1公里"
         },
         "🏬 南京路步行街": {
             bus: "乘坐20路直达，南京东路站下车",
             metro: "地铁2号线→南京东路站",
             walk: "沿南京东路向东步行约2公里",
             bike: "沿南京东路骑行约2公里，注意步行街区域需推行"
         },
         "🏬 徐家汇商圈": {
             bus: "乘坐926路直达，徐家汇站下车",
             metro: "地铁1号线→徐家汇站",
             walk: "沿漕溪北路向南步行约3公里",
             bike: "沿漕溪北路骑行约3公里，距离较长请量力而行"
         },
         "🏬 静安寺商圈": {
             bus: "乘坐57路→静安寺站下车",
             metro: "地铁2号线→静安寺站",
             walk: "沿南京西路向西步行约1公里",
             bike: "沿南京西路骑行约1公里"
         },
         "🌳 外滩": {
             bus: "乘坐42路→外滩站下车",
             metro: "地铁2号线→南京东路站→步行10分钟",
             walk: "沿南京东路向东步行至外滩约2.5公里",
             bike: "沿南京东路骑行至外滩约2.5公里，注意外滩区域人流密集"
         },
         "🌳 豫园": {
             bus: "乘坐64路→豫园站下车",
             metro: "地铁10号线→豫园站",
             walk: "沿人民路向南步行至豫园约2公里",
             bike: "沿人民路骑行至豫园约2公里"
         },
         "🏛️ 上海博物馆": {
             bus: "乘坐49路→人民广场站下车",
             metro: "地铁1号线→人民广场站",
             walk: "沿人民大道向东步行至博物馆约1.5公里",
             bike: "沿人民大道骑行约1.5公里"
         },
         "🏛️ 上海科技馆": {
             bus: "乘坐794路→上海科技馆站下车",
             metro: "地铁2号线→上海科技馆站",
             walk: "距离较远，不建议全程步行",
             bike: "沿世纪大道骑行约8公里，距离较远请谨慎选择"
         },
         "🚄 上海站": {
             bus: "乘坐104路→上海火车站下车",
             metro: "地铁1号线→上海火车站",
             walk: "沿秣陵路向北步行至上海站约2公里",
             bike: "沿秣陵路骑行至上海站约2公里"
         },
         "🚄 上海虹桥站": {
             bus: "乘坐941路→虹桥火车站下车",
             metro: "地铁2号线→虹桥火车站",
             walk: "距离过远，不建议全程步行",
             bike: "沿延安路骑行约15公里，距离过远不建议骑行"
         },
         "✈️ 虹桥机场": {
             bus: "乘坐925路→虹桥机场站下车",
             metro: "地铁10号线→虹桥1号航站楼站",
             walk: "距离过远，不建议全程步行",
             bike: "沿延安路骑行约12公里，距离过远不建议骑行"
         },
         "✈️ 浦东机场": {
             bus: "乘坐机场大巴→浦东机场站下车",
             metro: "地铁2号线→浦东国际机场站",
             walk: "距离过远，不建议全程步行",
             bike: "距离过远，不建议骑行"
         }
     };
     
     return routes[destinationName] || { 
         bus: "乘坐多辆公交车，需要换乘", 
         metro: "乘坐地铁，可能需要换乘",
         walk: "沿主要道路步行前往",
         bike: "沿主要道路骑行前往"
     };
 }

// 计算两点间距离（简化版）
function calculateDistance(coord1, coord2) {
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];
    
    const R = 6371; // 地球半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100; // 返回公里数，保留2位小数
}

// 生成公交路线
function generateBusRoute(start, end) {
    // 简化的路线生成
    return [
        start,
        [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],
        end
    ];
}

// 生成地铁路线
function generateSubwayRoute(start, end) {
    // 简化的路线生成
    return [
        start,
        [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],
        end
    ];
}

// 显示路线选项
function displayRoutes() {
    const container = document.getElementById('routeOptions');
    container.innerHTML = '';
    
    routes.forEach((route, index) => {
        const card = document.createElement('div');
        card.className = 'route-card';
        card.onclick = () => selectRoute(index);
        
        card.innerHTML = `
            <div class="route-header">
                <span class="route-type">${route.icon} ${route.type}</span>
                <span class="route-price">¥${route.price}</span>
            </div>
            <div class="route-details">
                <span class="route-time">⏱️ ${route.time}分钟</span>
                <span>🔄 ${route.transfers}次换乘</span>
            </div>
            <div class="route-description">${route.description}</div>
            <div style="margin-top: 10px; color: #0072ff; font-size: 14px;">${route.tips}</div>
        `;
        
        container.appendChild(card);
    });
}

// 在地图上绘制路线
function drawRoutesOnMap() {
    // 清除之前的路线
    map.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    
    // 重新添加地点标记
    addLocationMarkers();
    addTransportStations();
    
    // 绘制所有路线
    routes.forEach((route, index) => {
        const color = index === 0 ? '#00c6ff' : index === 1 ? '#ff6b6b' : '#4CAF50';
        const polyline = L.polyline(route.route, {
            color: color,
            weight: 4,
            opacity: 0.7
        }).addTo(map);
    });
    
    // 调整地图视野
    const allCoords = routes.flatMap(r => r.route);
    map.fitBounds(allCoords);
}

// 选择路线
function selectRoute(index) {
    // 更新选中状态
    document.querySelectorAll('.route-card').forEach((card, i) => {
        card.classList.toggle('selected', i === index);
    });
    
    currentRoute = routes[index];
    
    // 检查是否需要提示
    checkForElderlyTips(currentRoute);
    
    // 显示路线详情
    displayRouteDetails();
}

// 检查老年人提示（增强版）
function checkForElderlyTips(route) {
    const cheapestRoute = routes.reduce((min, r) => r.price < min.price ? r : min);
    const fastestRoute = routes.reduce((min, r) => r.time < min.time ? r : min);
    const distance = calculateDistance(userLocation, route.route[route.route.length-1]);
    
    // 时间过长的提醒
    if (route === cheapestRoute && route.time > fastestRoute.time * 1.5) {
        showTip('<div class="tip-warning"><h4>⏰ 时间提醒</h4><p>您选择的路线需要' + route.time + '分钟，时间较长。</p><p>如果选择' + fastestRoute.type + '，只需' + fastestRoute.time + '分钟，多花¥' + (fastestRoute.price - route.price) + '。</p><p>考虑到您的年龄，建议选择更快捷的出行方式，避免长时间等待。</p></div>');
    }
    
    // 近距离建议
    if (distance <= 0.5) {
        const walkRoute = routes.find(r => r.type === '步行');
        const bikeRoute = routes.find(r => r.type === '骑行');
        
        showTip('<div class="tip-success"><h4>🚶‍♂️ 近距离建议</h4><p>距离只有' + Math.round(distance * 1000) + '米，很近哦！</p><p>建议' + (walkRoute ? '步行' : '骑行') + '前往，既省钱又锻炼身体。</p><p>步行大约需要' + (walkRoute ? walkRoute.time : 5) + '分钟，完全免费！</p></div>');
    } else if (distance <= 1.5) {
        const bikeRoute = routes.find(r => r.type === '骑行');
        if (bikeRoute) {
            showTip('<div class="tip-info"><h4>🚲 骑行建议</h4><p>距离' + Math.round(distance * 1000) + '米，适合骑行前往。</p><p>骑行只需' + bikeRoute.time + '分钟，费用仅¥' + bikeRoute.price + '。</p><p>既环保又锻炼身体，但要注意交通安全！</p></div>');
        }
    }
    
    // 打车安全提醒
    if (route.type === '打车') {
        showTip('<div class="tip-safe"><h4>🚗 打车安全提醒</h4><p>费用：¥' + route.price + '，时间：' + route.time + '分钟</p><p>✅ 请确认车牌号和司机信息<br>✅ 上车前给家人报平安<br>✅ 保留行程记录<br>✅ 遇到异常及时联系家人</p><p style="color: #e74c3c; font-weight: bold;">安全第一，放心出行！</p></div>');
    }
    
    // 公交换乘提醒
    if (route.type === '公交' && route.transfers >= 2) {
        showTip('<div class="tip-warning"><h4>换乘提醒</h4><p>需要换乘' + route.transfers + '次，较为复杂。</p><p>建议：<br>• 提前准备零钱或公交卡<br>• 仔细听报站，避免坐过站<br>• 可以询问司机或乘客确认路线</p></div>');
    }
}

// 显示路线详情
function displayRouteDetails() {
    if (!currentRoute) return;
    
    // 获取具体换乘信息
    const destinationName = document.getElementById('endLocation').value;
    const routeInfo = getRouteDetails(userLocation, currentRoute.route[currentRoute.route.length-1], destinationName);
    
    let detailedSteps = '';
    if (currentRoute.type === '公交') {
        detailedSteps = routeInfo.bus ? generateBusSteps(routeInfo.bus, destinationName) : '';
    } else if (currentRoute.type === '地铁') {
        detailedSteps = routeInfo.metro ? generateMetroSteps(routeInfo.metro, destinationName) : '';
    } else if (currentRoute.type === '步行') {
        detailedSteps = routeInfo.walk ? generateWalkSteps(routeInfo.walk, destinationName) : '';
    } else if (currentRoute.type === '骑行') {
        detailedSteps = routeInfo.bike ? generateBikeSteps(routeInfo.bike, destinationName) : '';
    }
    
    const details = document.getElementById('routeDetails');
    details.innerHTML = '<div style="font-size: 18px; line-height: 1.8;"><p><strong>出行方式：</strong>' + currentRoute.icon + ' ' + currentRoute.type + '</p><p><strong>预计费用：</strong><span style="color: #ff6b6b; font-size: 24px;">¥' + currentRoute.price + '</span></p><p><strong>预计时间：</strong><span style="color: #0072ff;">' + currentRoute.time + '分钟</span></p><p><strong>换乘次数：</strong>' + currentRoute.transfers + '次</p><p><strong>路线描述：</strong>' + currentRoute.description + '</p><div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;"><strong>详细换乘步骤：</strong>' + detailedSteps + '</div><p><strong>温馨提示：</strong>' + currentRoute.tips + '</p></div>';
    
    document.getElementById('resultSection').style.display = 'block';
}

// 开始行程
function startJourney() {
    console.log('开始行程被点击，当前路线：', currentRoute);
    
    if (!currentRoute) {
        alert('请先选择一条路线！');
        return;
    }
    
    try {
        const message = '开始您的' + currentRoute.type + '之旅！\n\n从中国福利会少年宫到目的地\n预计时间：' + currentRoute.time + '分钟\n预计费用：¥' + currentRoute.price + '\n\n祝您一路平安！';
        alert(message);
        
        // 语音播报
        speak('开始' + currentRoute.type + '行程，预计' + currentRoute.time + '分钟到达');
    } catch (error) {
        console.error('开始行程时出错：', error);
        alert('操作成功！祝您一路平安！');
    }
}

// 交换起点和终点
function swapLocations() {
    const start = document.getElementById('startLocation');
    const end = document.getElementById('endLocation');
    
    if (end.value) {
        const temp = start.value;
        start.value = end.value;
        end.value = temp;
    }
}

// 地图控制函数 - 全局函数
window.zoomIn = function() {
    map.zoomIn();
}

window.zoomOut = function() {
    map.zoomOut();
}

window.locateUser = function() {
    map.setView(userLocation, 15);
}

// 帮助和提示
function showHelp() {
    document.getElementById('helpModal').style.display = 'block';
}

function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

function showTip(content) {
    document.getElementById('tipContent').innerHTML = content;
    document.getElementById('tipModal').style.display = 'block';
}

function closeTip() {
    document.getElementById('tipModal').style.display = 'none';
}

// 重试加载地图函数 - 全局函数
window.retryLoadMap = function() {
    console.log('正在重试加载地图...');
    document.getElementById('mapLoading').style.display = 'block';
    document.getElementById('mapLoading').innerHTML = '<div class="loading-spinner"></div><p>重新加载中...</p><p style="font-size: 14px; color: #666; margin-top: 5px;">正在尝试连接地图服务</p>';
    
    // 延迟重试，避免频繁请求
    setTimeout(() => {
        if (typeof L !== 'undefined') {
            initMap();
        } else {
            showOfflineMap();
        }
    }, 1000);
};

// 获取搜索建议（支持别名匹配）
function getSearchSuggestions(searchTerm) {
    const term = searchTerm.toLowerCase();
    const suggestions = [];
    
    // 基于别名和关键词提供建议
    locations.forEach(loc => {
        const allTexts = [
            loc.name.toLowerCase(),
            loc.address.toLowerCase(),
            ...(loc.aliases || []).map(a => a.toLowerCase())
        ];
        
        // 检查包含关系
        for (let text of allTexts) {
            if (text.includes(term) || term.includes(text.replace(/[^\u4e00-\u9fa5]/g, ''))) {
                if (!suggestions.includes(loc.name)) {
                    suggestions.push(loc.name);
                }
                break;
            }
        }
        
        // 检查关键词相似度
        const allKeywords = allTexts.map(t => t.replace(/[^\u4e00-\u9fa5]/g, ''));
        const termKeywords = term.replace(/[^\u4e00-\u9fa5]/g, '');
        
        for (let keywords of allKeywords) {
            let matchCount = 0;
            for (let char of termKeywords) {
                if (keywords.includes(char)) matchCount++;
            }
            
            if (matchCount >= Math.min(termKeywords.length, keywords.length) * 0.4) {
                if (!suggestions.includes(loc.name)) {
                    suggestions.push(loc.name);
                }
                break;
            }
        }
    });
    
    return suggestions.slice(0, 5); // 最多返回5个建议
}

// 增强的搜索地点功能
function searchLocation() {
    const searchTerm = document.getElementById('endLocation').value.toLowerCase();
    
    if (!searchTerm) {
        return;
    }
    
    const destination = fuzzySearch(searchTerm, locations);
    
    if (destination) {
        document.getElementById('endLocation').value = destination.name;
        searchRoute();
    } else {
        const suggestions = getSearchSuggestions(searchTerm);
        if (suggestions.length > 0) {
            alert('找不到"' + searchTerm + '"，您是想搜索：\n' + suggestions.join('\n'));
        } else {
            alert('找不到相关地点，请检查输入或选择推荐地点');
        }
    }
}

// 初始化天气信息
function initWeather() {
    const weatherText = document.getElementById('weatherText');
    const weatherIcon = document.querySelector('.weather-info i');
    
    // 模拟天气数据（实际项目中可使用真实天气API）
    const weatherData = {
        temp: '25°C',
        condition: '晴',
        icon: 'wi-day-sunny'
    };
    
    weatherText.textContent = weatherData.temp + ' ' + weatherData.condition;
    weatherIcon.className = 'wi ' + weatherData.icon;
}

// 更新实时时间
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    timeElement.textContent = timeString;
}

// 快捷搜索功能
function quickSearch(destination) {
    document.getElementById('endLocation').value = destination;
    searchRoute();
    
    // 添加动画效果
    Swal.fire({
        title: '正在搜索',
        text: '为您搜索到' + destination + '的路线...',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
    });
}

// 显示紧急联系
function showEmergency() {
    Swal.fire({
        title: '🚨 紧急联系',
        html: '<div style="text-align: left; font-size: 18px;"><p><i class="fas fa-phone" style="color: #e74c3c;"></i> <strong>急救电话：120</strong></p><p><i class="fas fa-shield-alt" style="color: #3498db;"></i> <strong>报警电话：110</strong></p><p><i class="fas fa-fire" style="color: #ff9800;"></i> <strong>火警电话：119</strong></p><p><i class="fas fa-phone-square" style="color: #2ecc71;"></i> <strong>家人电话：请提前设置</strong></p><hr><p style="font-size: 16px; color: #7f8c8d;"><i class="fas fa-info-circle"></i> 点击号码可直接拨打，建议将家人电话保存在手机通讯录</p></div>',
        confirmButtonText: '知道了',
        confirmButtonColor: '#0072ff'
    });
}

// 语音输入功能
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        Swal.fire({
            title: '提示',
            text: '您的浏览器不支持语音输入功能',
            icon: 'warning'
        });
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        Swal.fire({
            title: '请说话',
            text: '请说出您要去的地点...',
            icon: 'info',
            showConfirmButton: false,
            timer: 3000
        });
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('endLocation').value = transcript;
        searchRoute();
        
        Swal.fire({
            title: '识别成功',
            text: '您说的是：' + transcript,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    recognition.onerror = function() {
        Swal.fire({
            title: '识别失败',
            text: '请重试或手动输入',
            icon: 'error'
        });
    };

    recognition.start();
}

// 语音控制开关
let voiceControlEnabled = false;
function toggleVoiceControl() {
    voiceControlEnabled = !voiceControlEnabled;
    const btn = document.querySelector('.voice-btn');
    
    if (voiceControlEnabled) {
        btn.style.background = '#e74c3c';
        btn.innerHTML = '<i class="fas fa-microphone-slash"></i> 关闭';
        startVoiceControl();
    } else {
        btn.style.background = '';
        btn.innerHTML = '<i class="fas fa-microphone"></i> 语音';
    }
}

// 语音控制功能
function startVoiceControl() {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        
        // 简单的语音命令识别
        if (transcript.includes('搜索') || transcript.includes('查找')) {
            searchRoute();
        } else if (transcript.includes('帮助')) {
            showHelp();
        } else if (transcript.includes('医院')) {
            quickSearch('🏥 瑞金医院');
        } else if (transcript.includes('回家')) {
            alert('您当前就在家附近哦！');
        } else {
            document.getElementById('endLocation').value = transcript;
        }
    };

    recognition.start();
}

// 音效播放（简化版本，使用Web Audio API）
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'click':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                break;
            case 'welcome':
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.1;
                break;
            case 'alert':
                oscillator.frequency.value = 1000;
                gainNode.gain.value = 0.2;
                break;
        }
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch(e) {
        console.log('音效播放失败:', e);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 初始化天气和时间
    initWeather();
    updateTime();
    setInterval(updateTime, 1000);
    
    // 添加按钮点击音效
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => playSound('click'));
    });
    
    // 检测网络状态
    if (navigator.onLine === false) {
        console.warn('检测到离线状态');
        showOfflineMap();
        return;
    }
    
    // 确保Leaflet库已加载
    if (typeof L === 'undefined') {
        console.error('Leaflet库未加载');
        showOfflineMap();
    } else {
        initMap();
    }
    
    // 添加欢迎动画
    setTimeout(() => {
        Swal.fire({
            title: '欢迎使用智慧出行',
            text: '专为老年人设计的友好导航系统',
            icon: 'success',
            confirmButtonText: '开始使用',
            confirmButtonColor: '#0072ff'
        });
    }, 1000);
    
    // 添加回车键搜索功能和实时搜索建议
    const endLocationInput = document.getElementById('endLocation');
    if (endLocationInput) {
        // 回车键搜索
        endLocationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRoute();
            }
        });
        
        // 输入时实时显示建议
        endLocationInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length >= 1) {
                const suggestions = getSearchSuggestions(searchTerm);
                updateDatalist(suggestions);
            }
        });
    }
    
    // 快捷功能按钮
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            playSound('click');
            const type = this.dataset.type;
            quickSearch(type);
        });
    });
    
    // 语音输入按钮
    const voiceInputBtn = document.getElementById('voiceInputBtn');
    if (voiceInputBtn) {
        voiceInputBtn.addEventListener('click', startVoiceInput);
    }
    
    // 语音控制按钮
    const voiceControlBtn = document.getElementById('voiceControlBtn');
    if (voiceControlBtn) {
        voiceControlBtn.addEventListener('click', toggleVoiceControl);
    }
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    
    // 添加网络状态监听
    window.addEventListener('online', function() {
        console.log('网络已恢复，重新加载地图');
        retryLoadMap();
    });
    
    // 添加调试信息
    console.log('所有事件监听器已设置');
});

// 添加语音播报功能（简化版）
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8; // 放慢语速
        speechSynthesis.speak(utterance);
    }
}

// 为重要操作添加语音反馈
function addVoiceFeedback() {
    document.querySelectorAll('.route-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const routeType = this.querySelector('.route-type').textContent;
            const price = this.querySelector('.route-price').textContent;
            speak('选择' + routeType + '，费用' + price);
        });
    });
}

// 在显示路线后添加语音反馈
const originalDisplayRoutes = displayRoutes;
displayRoutes = function() {
    originalDisplayRoutes();
    setTimeout(addVoiceFeedback, 100);
};

// 初始化天气信息
function initWeather() {
    const weatherData = {
        temp: 22,
        condition: '晴',
        icon: 'wi-day-sunny'
    };
    
    const weatherElement = document.getElementById('weatherInfo');
    if (weatherElement) {
        weatherElement.innerHTML = '<i class="wi ' + weatherData.icon + '"></i><span>' + weatherData.temp + '°C ' + weatherData.condition + '</span>';
    }
}

// 更新时间显示
function updateTime() {
    const timeElement = document.getElementById('timeInfo');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        timeElement.innerHTML = '<i class="fas fa-clock"></i><span>' + timeString + '</span>';
    }
}

// 快捷搜索功能
function quickSearch(type) {
    const destinations = {
        hospital: ['瑞金医院', '华山医院', '中山医院'],
        shopping: ['南京路步行街', '徐家汇商圈', '静安寺商圈'],
        park: ['外滩', '豫园'],
        culture: ['上海博物馆', '上海科技馆']
    };
    
    const names = destinations[type] || [];
    const randomDest = names[Math.floor(Math.random() * names.length)];
    
    if (randomDest) {
        document.getElementById('endLocation').value = randomDest;
        searchRoute();
        speak('正在为您搜索' + randomDest + '的路线');
    }
}

// 显示紧急联系
function showEmergency() {
    Swal.fire({
        title: '🚨 紧急联系',
        html: '<div style="text-align: left; font-size: 18px;"><p><strong>急救电话：</strong>120</p><p><strong>报警电话：</strong>110</p><p><strong>火警电话：</strong>119</p><p><strong>家属联系：</strong>请提前设置</p></div>',
        icon: 'warning',
        confirmButtonText: '知道了',
        confirmButtonColor: '#ff6b6b'
    });
    playSound('alert');
}

// 开始语音输入
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        Swal.fire({
            title: '提示',
            text: '您的浏览器不支持语音识别功能，请手动输入目的地',
            icon: 'info',
            confirmButtonText: '知道了',
            confirmButtonColor: '#0072ff'
        });
        return;
    }
    
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = function() {
            const btn = document.getElementById('voiceInputBtn');
            btn.innerHTML = '<i class="fas fa-microphone-slash"></i> 正在聆听';
            btn.style.background = 'linear-gradient(135deg, #ff6b6b, #e74c3c)';
            playSound('click');
            speak('请说出您要去的地方');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('endLocation').value = transcript;
            speak('已识别：' + transcript);
            searchRoute();
        };
        
        recognition.onerror = function(event) {
            let errorMsg = '';
            let showManualInput = false;
            
            switch(event.error) {
                case 'no-speech':
                    errorMsg = '没有检测到语音，请重试';
                    break;
                case 'audio-capture':
                    errorMsg = '无法获取麦克风权限，请检查设备';
                    break;
                case 'not-allowed':
                    errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许访问';
                    break;
                case 'network':
                    errorMsg = '网络连接问题导致语音识别失败';
                    showManualInput = true;
                    break;
                default:
                    errorMsg = '语音识别出错：' + event.error;
                    showManualInput = true;
            }
            
            if (showManualInput) {
                Swal.fire({
                    title: '语音识别失败',
                    html: `<div style="text-align: left;">
                        <p><strong>问题：</strong>${errorMsg}</p>
                        <p><strong>解决方案：</strong></p>
                        <ol>
                            <li>检查网络连接是否正常</li>
                            <li>刷新页面后重试</li>
                            <li>使用HTTPS协议访问</li>
                            <li>手动输入目的地</li>
                        </ol>
                    </div>`,
                    icon: 'error',
                    confirmButtonText: '手动输入',
                    confirmButtonColor: '#0072ff',
                    showCancelButton: true,
                    cancelButtonText: '重试',
                    cancelButtonColor: '#6c757d'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById('endLocation').focus();
                    } else {
                        startVoiceInput(); // 重试
                    }
                });
            } else {
                Swal.fire({
                    title: '语音识别失败',
                    text: errorMsg,
                    icon: 'error',
                    confirmButtonText: '重试',
                    confirmButtonColor: '#0072ff'
                });
            }
            playSound('alert');
        };
        
        recognition.onend = function() {
            const btn = document.getElementById('voiceInputBtn');
            btn.innerHTML = '<i class="fas fa-microphone"></i> 语音';
            btn.style.background = 'linear-gradient(135deg, #ff6b6b, #e74c3c)';
        };
        
        recognition.start();
    } catch (error) {
        Swal.fire({
            title: '错误',
            text: '启动语音识别失败：' + error.message,
            icon: 'error',
            confirmButtonText: '确定',
            confirmButtonColor: '#0072ff'
        });
    }
}

// 语音控制功能
let voiceControlActive = false;
let recognition = null;

function toggleVoiceControl() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        Swal.fire({
            title: '提示',
            text: '您的浏览器不支持语音控制功能',
            icon: 'info',
            confirmButtonText: '知道了',
            confirmButtonColor: '#0072ff'
        });
        return;
    }
    
    if (voiceControlActive) {
        stopVoiceControl();
    } else {
        startVoiceControl();
    }
}

function startVoiceControl() {
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        voiceControlActive = true;
        const btn = document.getElementById('voiceControlBtn');
        btn.innerHTML = '<i class="fas fa-stop"></i> 停止语音';
        btn.style.background = 'linear-gradient(135deg, #ff6b6b, #e74c3c)';
        
        recognition.lang = 'zh-CN';
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = function() {
            playSound('welcome');
            speak('语音控制已开启，您可以说：搜索、医院、购物、公园、博物馆、帮助、紧急等指令');
        };
        
        recognition.onresult = function(event) {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
            
            // 显示识别的文字
            Swal.fire({
                title: '语音识别',
                text: '识别到：' + command,
                icon: 'info',
                timer: 1500,
                showConfirmButton: false,
                position: 'top-end'
            });
            
            if (command.includes('搜索') || command.includes('查询') || command.includes('找')) {
                searchRoute();
                speak('正在为您搜索路线');
            } else if (command.includes('医院') || command.includes('看病')) {
                quickSearch('hospital');
                speak('正在为您搜索医院');
            } else if (command.includes('购物') || command.includes('超市') || command.includes('买东西')) {
                quickSearch('shopping');
                speak('正在为您搜索购物地点');
            } else if (command.includes('公园') || command.includes('散步')) {
                quickSearch('park');
                speak('正在为您搜索公园');
            } else if (command.includes('博物馆') || command.includes('图书馆') || command.includes('文化')) {
                quickSearch('culture');
                speak('正在为您搜索文化场所');
            } else if (command.includes('帮助') || command.includes('怎么用')) {
                showHelp();
                speak('已打开使用帮助');
            } else if (command.includes('紧急') || command.includes('急救') || command.includes('报警')) {
                showEmergency();
                speak('已打开紧急联系信息');
            } else if (command.includes('停止') || command.includes('关闭')) {
                stopVoiceControl();
                speak('语音控制已关闭');
            } else {
                // 如果是不明确的命令，将其作为目的地
                document.getElementById('endLocation').value = command;
                searchRoute();
                speak('正在为您搜索' + command + '的路线');
            }
        };
        
        recognition.onerror = function(event) {
            let errorMsg = '';
            let showHelp = false;
            
            switch(event.error) {
                case 'no-speech':
                    errorMsg = '没有检测到语音，请再说一次';
                    break;
                case 'audio-capture':
                    errorMsg = '无法获取麦克风权限，请检查设备';
                    break;
                case 'not-allowed':
                    errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许访问';
                    break;
                case 'network':
                    errorMsg = '网络连接问题导致语音控制失败';
                    showHelp = true;
                    break;
                default:
                    errorMsg = '语音识别出错：' + event.error;
                    showHelp = true;
            }
            
            if (showHelp) {
                Swal.fire({
                    title: '语音控制失败',
                    html: `<div style="text-align: left;">
                        <p><strong>问题：</strong>${errorMsg}</p>
                        <p><strong>网络问题解决方案：</strong></p>
                        <ol>
                            <li>确保网络连接正常</li>
                            <li>使用HTTPS协议访问网页</li>
                            <li>尝试刷新页面重试</li>
                            <li>检查浏览器麦克风权限</li>
                        </ol>
                        <p><strong>备用方案：</strong>您仍可使用按钮和输入框手动操作</p>
                    </div>`,
                    icon: 'error',
                    confirmButtonText: '了解',
                    confirmButtonColor: '#0072ff'
                });
            } else {
                Swal.fire({
                    title: '语音控制失败',
                    text: errorMsg,
                    icon: 'error',
                    confirmButtonText: '重试',
                    confirmButtonColor: '#0072ff'
                });
            }
            playSound('alert');
        };
        
        recognition.onend = function() {
            if (voiceControlActive) {
                // 如果是意外断开，重新启动
                setTimeout(() => {
                    if (voiceControlActive && recognition) {
                        recognition.start();
                    }
                }, 1000);
            }
        };
        
        recognition.start();
    } catch (error) {
        Swal.fire({
            title: '错误',
            text: '启动语音控制失败：' + error.message,
            icon: 'error',
            confirmButtonText: '确定',
            confirmButtonColor: '#0072ff'
        });
    }
}

function stopVoiceControl() {
    voiceControlActive = false;
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    const btn = document.getElementById('voiceControlBtn');
    btn.innerHTML = '<i class="fas fa-microphone"></i> 语音';
    btn.style.background = 'linear-gradient(135deg, #00c6ff, #0072ff)';
    speak('语音控制已关闭');
}