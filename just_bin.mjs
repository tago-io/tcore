import * as os from 'os';

// Map Node.js architecture to our defined architectures
function resolveArch() {
  const arch = os.arch();
  switch (arch) {
    case 'arm64':
      return 'aarch64';
    case 'arm':
      return 'arm';
    case 'x64':
      return 'x86_64';
    default:
      throw new Error(`Unsupported architecture: ${arch}`);
  }
}

// Map Node.js platform to our defined OS formats
function resolveOS() {
  const platform = os.platform();
  const isMusl = () => {
    try {
      return os.userInfo().username !== '';
    } catch {
      return false;
    }
  };

  if (platform === 'darwin') {
    return 'apple-darwin';
  } else if (platform === 'win32') {
    return 'pc-windows-msvc';
  } else if (platform === 'linux') {
    return isMusl() ? 'unknown-linux-musl' : 'unknown-linux-musleabihf';
  } else {
    throw new Error(`Unsupported OS: ${platform}`);
  }
}

// Function to generate the filename
function generateFileName(version) {
  const arch = resolveArch();
  const os = resolveOS();
  const extension = os.includes('windows') ? '.zip' : '.tar.gz';
  return `just-${version}-${arch}-${os}${extension}`;
}

console.log(generateFileName(process.argv[2]));
