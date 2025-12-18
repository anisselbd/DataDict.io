const API_URL = 'http://localhost:3001/api';

// Helper to get token
function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// Helper for authenticated requests
async function authFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }

    // Handle empty responses
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

// ============================================
// PROJECTS
// ============================================

export async function getProjects(query = {}) {
    const params = new URLSearchParams(query).toString();
    const data = await authFetch(`/projects${params ? `?${params}` : ''}`);
    return data.data || [];
}

export async function getProject(projectId) {
    return authFetch(`/projects/${projectId}`);
}

export async function createProject(projectData) {
    return authFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
    });
}

export async function updateProject(projectId, projectData) {
    return authFetch(`/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify(projectData),
    });
}

export async function deleteProject(projectId) {
    return authFetch(`/projects/${projectId}`, {
        method: 'DELETE',
    });
}

export async function duplicateProject(projectId) {
    return authFetch(`/projects/${projectId}/duplicate`, {
        method: 'POST',
    });
}

// ============================================
// ENTITIES
// ============================================

export async function getProjectEntities(projectId) {
    const data = await authFetch(`/entities?projectId=${projectId}`);
    return data.data || [];
}

export async function getEntity(entityId) {
    return authFetch(`/entities/${entityId}`);
}

export async function createEntity(entityData) {
    return authFetch('/entities', {
        method: 'POST',
        body: JSON.stringify(entityData),
    });
}

export async function updateEntity(entityId, entityData) {
    return authFetch(`/entities/${entityId}`, {
        method: 'PATCH',
        body: JSON.stringify(entityData),
    });
}

export async function deleteEntity(entityId) {
    return authFetch(`/entities/${entityId}`, {
        method: 'DELETE',
    });
}

// ============================================
// FIELDS
// ============================================

export async function getFields(query = {}) {
    const params = new URLSearchParams(query).toString();
    const data = await authFetch(`/fields${params ? `?${params}` : ''}`);
    return data.data || [];
}

export async function getField(fieldId) {
    return authFetch(`/fields/${fieldId}`);
}

export async function createField(fieldData) {
    return authFetch('/fields', {
        method: 'POST',
        body: JSON.stringify(fieldData),
    });
}

export async function updateField(fieldId, fieldData) {
    return authFetch(`/fields/${fieldId}`, {
        method: 'PATCH',
        body: JSON.stringify(fieldData),
    });
}

export async function deleteField(fieldId) {
    return authFetch(`/fields/${fieldId}`, {
        method: 'DELETE',
    });
}

// ============================================
// EXPORT
// ============================================

export async function exportProjectMarkdown(projectId) {
    const token = getToken();
    const res = await fetch(`${API_URL}/projects/${projectId}/export/markdown`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.text();
}

export async function exportProjectPdf(projectId) {
    const token = getToken();
    const res = await fetch(`${API_URL}/projects/${projectId}/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
}


// ============================================
// RELATIONS
// ============================================

export async function createRelation(relationData) {
    return authFetch('/relations', {
        method: 'POST',
        body: JSON.stringify(relationData),
    });
}

export async function getEntityRelations(entityId) {
    return authFetch(`/relations/entity/${entityId}`);
}

export async function getProjectRelations(projectId) {
    return authFetch(`/relations?projectId=${projectId}`);
}

export async function deleteRelation(relationId) {
    return authFetch(`/relations/${relationId}`, {
        method: 'DELETE',
    });
}

// ============================================
// REORDERING
// ============================================

export async function reorderEntities(projectId, entityIds) {
    return authFetch(`/entities/reorder?projectId=${projectId}`, {
        method: 'POST',
        body: JSON.stringify({ entityIds }),
    });
}

export async function reorderFields(entityId, fieldIds) {
    return authFetch(`/fields/reorder?entityId=${entityId}`, {
        method: 'POST',
        body: JSON.stringify({ fieldIds }),
    });
}

// ============================================
// PUBLIC (no auth required)
// ============================================

export async function getPublicProject(slug) {
    const res = await fetch(`${API_URL}/projects/public/${slug}`);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Project not found' }));
        throw new Error(error.message || 'Project not found');
    }
    return res.json();
}

