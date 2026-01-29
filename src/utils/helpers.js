export const getImageUrl = (path) => {
  if (!path) {
    return 'https://ui-avatars.com/api/?name=User&background=f1f5f9&color=64748b';
  }
  if (path.startsWith('http')) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return new Intl.NumberFormat().format(num)
}