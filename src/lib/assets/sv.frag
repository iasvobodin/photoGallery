#ifdef GL_ES
  precision mediump float;
  #endif

  #define PI2 6.28318530718
  #define PI 3.14159265359
  #define S(a,b,n) smoothstep(a,b,n)

  // uniform float uTime;
  uniform float uProgress;
  uniform float uIntensiv;
  uniform vec2 uReso;
  // uniform vec2 uMouse;
  
  // get our varyings
  varying vec3 vVertexPosition;
  varying vec2 vActiveTextureCoord;
  varying vec2 vNextTextureCoord;
  varying vec2 vMapTextureCoord;

  // the uniform we declared inside our javascript

  // our texture sampler (default name, to use a different name please refer to the documentation)
  uniform sampler2D activeTex;
  uniform sampler2D nextTex;
  uniform sampler2D mapTex;


  vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;
    color += texture2D(image, uv) * 0.1964825501511404;
    color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
    return color;
  }

  // void main(){
  //   vec2 uv0 = vActiveTextureCoord;
  //   vec2 uv1 = vNextTextureCoord;

  //   float progress0 = uProgress;
  //   float progress1 = 1. - uProgress;

  //   vec4 map = blur13(map, vMapTextureCoord, uReso, vec2(2.)) + 0.5;

  //   uv0.x += progress0 * map.r;
  //   uv1.x -= progress1 * map.r;

  //   vec4 color = texture2D( activeTex, uv0 );
  //   vec4 color1 = texture2D( nextTex, uv1 );

  //   gl_FragColor = mix(color, color1, progress0 );          
  // }





  mat2 rotate(float a) {
			float s = sin(a);
			float c = cos(a);
			return mat2(c, -s, s, c);
		}


		// void main()	{
		// 	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

		// 	vec2 uvDivided1 = fract(vActiveTextureCoord*vec2(uIntensiv,1.));
    //   vec2 uvDivided2 = fract(vNextTextureCoord*vec2(uIntensiv,1.));

		// 	vec2 uvDisplaced1 = vActiveTextureCoord + rotate(3.1415926/4.)*uvDivided1*uProgress*0.1;
		// 	vec2 uvDisplaced2 = vNextTextureCoord + rotate(3.1415926/4.)*uvDivided2*(1. - uProgress)*0.1;
		// 	vec4 t1 = texture2D(activeTex,uvDisplaced1);
		// 	vec4 t2 = texture2D(nextTex,uvDisplaced2);
		// 	gl_FragColor = mix(t1, t2, uProgress);
		// }
    float angle1 = PI *0.25;
    float angle2 = -PI *0.75;

    void main()	{

    vec4 disp = blur13(mapTex, vMapTextureCoord, uReso, vec2(2.)); //+ 10.5;
			// vec4 disp = texture2D(mapTex, vMapTextureCoord);
			vec2 dispVec = vec2(disp.r, disp.g);

			vec2 distortedPosition1 = vActiveTextureCoord + rotate(angle1) * dispVec * uIntensiv * uProgress;
			vec2 distortedPosition2 = vNextTextureCoord + rotate(angle2) * dispVec * uIntensiv * (1.0 - uProgress);

			vec4 t1 = texture2D(activeTex, distortedPosition1);
			vec4 t2 = texture2D(nextTex, distortedPosition2);

			gl_FragColor = mix(t1, t2, uProgress);
		}