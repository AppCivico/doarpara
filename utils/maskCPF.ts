export default (value:string) => formatCPF(value).replace(/^\d{3}/, '***').replace(/\d{2}$/, '**');
