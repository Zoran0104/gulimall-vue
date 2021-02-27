/**
 * 开发环境
 */
;
(function() {
    window.SITE_CONFIG = {};

    // api接口请求地   转发给后端网关gateway的88端口（让网关统一代理转发）
    window.SITE_CONFIG['baseUrl'] = 'http://localhost:88/api';

    // cdn地址 = 域名 + 版本号
    window.SITE_CONFIG['domain'] = './'; // 域名
    window.SITE_CONFIG['version'] = ''; // 版本号(年月日时分)
    window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();