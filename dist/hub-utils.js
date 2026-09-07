const hubUtils = {
    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },
    sourceHref(value) {
        try {
            const u = new URL(String(value));
            return /^https?:$/.test(u.protocol) ? hubUtils.escapeHtml(u.href) : '#';
        }
        catch {
            return '#';
        }
    },
    matches(text, query) {
        const normalize = (value) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const hay = normalize(text);
        return normalize(query).trim().split(/\s+/).every(part => hay.includes(part));
    },
    parseRoute(hash) {
        const raw = hash.replace(/^#/, '') || 'overview', split = raw.indexOf('?');
        const path = split < 0 ? raw : raw.slice(0, split), params = new URLSearchParams(split < 0 ? '' : raw.slice(split + 1));
        const [route, rawId] = path.split('/');
        let id = '';
        try {
            id = decodeURIComponent(rawId || '');
        }
        catch { }
        return { route, id, params };
    },
    sourceDate(value) {
        if (!value)
            return 'Date unavailable';
        const raw = String(value);
        if (/^\d{4}(-\d{2})?$/.test(raw))
            return raw;
        const date = new Date(raw);
        return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    },
};
