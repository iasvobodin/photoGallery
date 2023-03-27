#ifdef GL_ES
  precision mediump float;
  #endif

  // those are the mandatory attributes that the lib sets
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  // those are mandatory uniforms that the lib sets and that contain our model view and projection matrix
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  uniform mat4 activeTexMatrix;
  uniform mat4 nextTexMatrix;
  uniform mat4 mapTexMatrix;

  // if you want to pass your vertex and texture coords to the fragment shader
  varying vec3 vVertexPosition;
  varying vec2 vActiveTextureCoord;
  varying vec2 vNextTextureCoord;
  varying vec2 vMapTextureCoord;

  void main() {
    vec3 vertexPosition = aVertexPosition;

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    // set the varyings
    vActiveTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vNextTextureCoord = (nextTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vMapTextureCoord = (mapTexMatrix * vec4(aTextureCoord, 0., 1.)).xy;
    vVertexPosition = vertexPosition;
  }