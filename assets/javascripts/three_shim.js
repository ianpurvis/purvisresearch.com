// This shim contains the subset of three.js that is needed for DRACOLoader
// and can be used by an imports-loader to provide a minimal THREE global.
export {
  BufferGeometry,
  FileLoader,
  Float32BufferAttribute,
  Int16BufferAttribute,
  Int32BufferAttribute,
  Int8BufferAttribute,
  TriangleStripDrawMode,
  TrianglesDrawMode,
  Uint16BufferAttribute,
  Uint32BufferAttribute,
  Uint8BufferAttribute,
} from 'three'
