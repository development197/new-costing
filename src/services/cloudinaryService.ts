import { v2 as cloudinary } from 'cloudinary';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
cloudinary.config({
  cloud_name: 'digitalipsum',
  api_key: '467941342795696',
  api_secret: 'zM7ZBuXF22qw4YKMdIXNDXGAl8Q',
});

export default cloudinary;