import axios from 'axios';

const resolveTenant = async () => {
  const host = window.location.hostname.replace(/^www\./, '');

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/tenants/resolve`,
    { params: { host } }
  );

  console.log('Resolved tenant response:', data);
  return data;
};

export default resolveTenant;
