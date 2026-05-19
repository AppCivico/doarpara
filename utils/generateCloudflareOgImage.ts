const generateCloudflareOgImage = (url: string, baseUrl = ''): string => `${baseUrl}/cdn-cgi/image/width=1200,height=630,fit=cover,gravity=face,format=jpeg,quality=80/${url}`;

export default generateCloudflareOgImage;
