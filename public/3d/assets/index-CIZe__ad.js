const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/motionPanel-ccF49xnn.js","assets/three.core-DHN0CKgI.js","assets/arModal-BMYDkXYK.js"])))=>i.map(i=>d[i]);
import{$ as e,$n as t,A as n,An as r,At as i,Bn as a,Bt as o,C as s,Cn as c,Ct as l,D as u,Dt as d,Et as f,F as p,Fn as m,Ft as h,G as g,Gn as _,H as v,Hn as y,I as b,In as x,J as S,Jn as C,K as w,Kn as T,L as E,Ln as D,M as O,Mn as ee,Mt as k,Nn as A,Nt as j,O as te,Ot as M,P as ne,Q as re,Qn as ie,R as ae,Rn as oe,S as se,Sn as ce,St as N,T as le,Tt as P,U as F,Un as ue,V as de,Vn as fe,W as pe,Wn as me,X as he,Xn as ge,Y as _e,Z as ve,_ as ye,_n as be,_r as xe,_t as Se,a as Ce,ar as we,at as Te,b as Ee,bn as De,bt as Oe,c as ke,cr as Ae,ct as je,dr as Me,dt as Ne,er as Pe,et as I,f as Fe,fr as Ie,ft as Le,g as Re,gn as L,gr as ze,gt as R,h as z,hr as Be,ht as Ve,i as He,ir as Ue,it as We,j as Ge,jn as Ke,jt as qe,k as Je,kt as Ye,l as Xe,lr as Ze,lt as B,m as Qe,mr as $e,mt as et,n as tt,nr as V,nt,o as rt,or as it,ot as at,p as H,pr as ot,pt as st,q as ct,qn as lt,r as ut,rr as U,rt as dt,s as ft,sr as pt,st as mt,tr as ht,tt as gt,u as _t,ur as vt,ut as yt,v as bt,vn as xt,vr as W,vt as St,w as Ct,wn as wt,wt as Tt,x as Et,xt as Dt,y as Ot,yn as kt,yr as At,yt as jt,z as Mt,zn as Nt,zt as Pt}from"./three.core-DHN0CKgI.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function Ft(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function It(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var G={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},K={common:{diffuse:{value:new H(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new B}},envmap:{envMap:{value:null},envMapRotation:{value:new B},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new B}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new B}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new B},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new B},normalScale:{value:new V(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new B},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new B}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new B}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new B}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new H(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new H(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0},uvTransform:{value:new B}},sprite:{diffuse:{value:new H(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}}},Lt={basic:{uniforms:ze([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:G.meshbasic_vert,fragmentShader:G.meshbasic_frag},lambert:{uniforms:ze([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new H(0)},envMapIntensity:{value:1}}]),vertexShader:G.meshlambert_vert,fragmentShader:G.meshlambert_frag},phong:{uniforms:ze([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new H(0)},specular:{value:new H(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:G.meshphong_vert,fragmentShader:G.meshphong_frag},standard:{uniforms:ze([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new H(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag},toon:{uniforms:ze([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new H(0)}}]),vertexShader:G.meshtoon_vert,fragmentShader:G.meshtoon_frag},matcap:{uniforms:ze([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:G.meshmatcap_vert,fragmentShader:G.meshmatcap_frag},points:{uniforms:ze([K.points,K.fog]),vertexShader:G.points_vert,fragmentShader:G.points_frag},dashed:{uniforms:ze([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:G.linedashed_vert,fragmentShader:G.linedashed_frag},depth:{uniforms:ze([K.common,K.displacementmap]),vertexShader:G.depth_vert,fragmentShader:G.depth_frag},normal:{uniforms:ze([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:G.meshnormal_vert,fragmentShader:G.meshnormal_frag},sprite:{uniforms:ze([K.sprite,K.fog]),vertexShader:G.sprite_vert,fragmentShader:G.sprite_frag},background:{uniforms:{uvTransform:{value:new B},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:G.background_vert,fragmentShader:G.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new B}},vertexShader:G.backgroundCube_vert,fragmentShader:G.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:G.cube_vert,fragmentShader:G.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:G.equirect_vert,fragmentShader:G.equirect_frag},distance:{uniforms:ze([K.common,K.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:G.distance_vert,fragmentShader:G.distance_frag},shadow:{uniforms:ze([K.lights,K.fog,{color:{value:new H(0)},opacity:{value:1}}]),vertexShader:G.shadow_vert,fragmentShader:G.shadow_frag}};Lt.physical={uniforms:ze([Lt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new B},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new B},clearcoatNormalScale:{value:new V(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new B},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new B},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new B},sheen:{value:0},sheenColor:{value:new H(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new B},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new B},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new B},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new B},attenuationDistance:{value:0},attenuationColor:{value:new H(0)},specularColor:{value:new H(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new B},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new B},anisotropyVector:{value:new V},anisotropyMap:{value:null},anisotropyMapTransform:{value:new B}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag};var Rt={r:0,b:0,g:0},zt=new yt,Bt=new B;Bt.set(-1,0,0,0,1,0,0,0,1);function Vt(e,t,n,r,i,a){let o=new H(0),s=i===!0?0:1,c,l,u=null,d=0,p=null;function m(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function h(t){let r=!1,i=m(t);i===null?_(o,s):i&&i.isColor&&(_(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let i=m(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Ne(new ke(1,1,1),new A({name:`BackgroundCubeMaterial`,uniforms:Ze(Lt.backgroundCube.uniforms),vertexShader:Lt.backgroundCube.vertexShader,fragmentShader:Lt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(zt.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Bt),l.material.toneMapped=Qe.getTransfer(i.colorSpace)!==Ke,(u!==i||d!==i.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Ne(new f(2,2),new A({name:`BackgroundMaterial`,uniforms:Ze(Lt.background.uniforms),vertexShader:Lt.background.vertexShader,fragmentShader:Lt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(i.colorSpace)!==Ke,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||p!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,p=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function _(t,r){t.getRGB(Rt,$e(e)),n.buffers.color.setClear(Rt.r,Rt.g,Rt.b,r,a)}function v(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,_(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,_(o,s)},render:h,addToRenderList:g,dispose:v}}function Ht(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Ut(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Wt(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return!(t!==1023&&r.convert(t)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(W(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&W(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Gt(e){let t=this,n=null,r=0,i=!1,a=!1,o=new P,s=new B,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Kt=4,qt=[.125,.215,.35,.446,.526,.582],Jt=20,Yt=256,Xt=new l,Zt=new H,Qt=null,$t=0,en=0,tn=!1,nn=new U,rn=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=nn}=i;Qt=this._renderer.getRenderTarget(),$t=this._renderer.getActiveCubeFace(),en=this._renderer.getActiveMipmapLevel(),tn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dn(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=un(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qt,$t,en),this._renderer.xr.enabled=tn,e.scissorTest=!1,sn(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qt=this._renderer.getRenderTarget(),$t=this._renderer.getActiveCubeFace(),en=this._renderer.getActiveMipmapLevel(),tn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:re,minFilter:re,generateMipmaps:!1,type:p,format:Pt,colorSpace:gt,depthBuffer:!1},r=on(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=on(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=an(r)),this._blurMaterial=ln(r,e,t),this._ggxMaterial=cn(r,e,t)}return r}_compileMaterial(e){let t=new Ne(new _t,e);this._renderer.compile(t,Xt)}_sceneToCubeUV(e,t,n,r,i){let a=new Tt(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Zt),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ne(new ke,new Le({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Zt),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;sn(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=dn()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=un());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;sn(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Xt)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Kt?n-d+Kt:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,sn(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Xt),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,sn(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Xt)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&Ie(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/(2*Jt-1),p=i/f,m=isFinite(i)?1+Math.floor(3*p):Jt;m>Jt&&W(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Jt}`);let h=[],g=0;for(let e=0;e<Jt;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];sn(t,3*v*(r>_-Kt?r-_+Kt:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Xt)}};function an(e){let t=[],n=[],r=[],i=e,a=e-Kt+1+qt.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Kt?s=qt[o-e+Kt-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new _t;h.setAttribute(`position`,new Xe(f,3)),h.setAttribute(`uv`,new Xe(p,2)),h.setAttribute(`faceIndex`,new Xe(m,1)),r.push(new Ne(h,null)),i>Kt&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function on(e,t,n){let r=new pt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function sn(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function cn(e,t,n){return new A({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Yt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:fn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ln(e,t,n){let r=new Float32Array(Jt),i=new U(0,1,0);return new A({name:`SphericalGaussianBlur`,defines:{n:Jt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:fn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function un(){return new A({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:fn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function dn(){return new A({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function fn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var pn=class extends pt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new bt(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ke(5,5,5),i=new A({name:`CubemapFromEquirect`,uniforms:Ze(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ne(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=re),new Re(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function mn(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304)if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}else{let r=n.image;if(r&&r.height>0){let i=new pn(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}else return null}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new rn(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new rn(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function hn(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&At(`WebGLRenderer: `+e+` extension not supported.`),t}}}function gn(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?T:_)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function _n(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function vn(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Ie(`WebGLInfo: Unknown draw mode:`,r);break}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function yn(e,t,n){let r=new WeakMap,i=new Ue;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Ee(h,p,m,u);g.type=Ge,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new V(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function bn(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var xn={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Sn(e,t,r,i,a,o){let s=new pt(t,r,{type:e,depthBuffer:a,stencilBuffer:o,samples:i?4:0,depthTexture:a?new Ct(t,r):void 0}),c=new pt(t,r,{type:p,depthBuffer:!1,stencilBuffer:!1}),u=new _t;u.setAttribute(`position`,new n([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new n([0,2,0,0,2,0],2));let d=new xt({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Ne(u,d),m=new l(-1,1,1,-1,0,1),h=null,g=null,_=!1,v,y=null,b=[],x=!1;this.setSize=function(e,t){s.setSize(e,t),c.setSize(e,t);for(let n=0;n<b.length;n++){let r=b[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){b=e,x=b.length>0&&b[0].isRenderPass===!0;let t=s.width,n=s.height;for(let e=0;e<b.length;e++){let r=b[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(_||e.toneMapping===0&&b.length===0)return!1;if(y=t,t!==null){let e=t.width,n=t.height;(s.width!==e||s.height!==n)&&this.setSize(e,n)}return x===!1&&e.setRenderTarget(s),v=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return x},this.end=function(e,t){e.toneMapping=v,_=!0;let n=s,r=c;for(let i=0;i<b.length;i++){let a=b[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(h!==e.outputColorSpace||g!==e.toneMapping){h=e.outputColorSpace,g=e.toneMapping,d.defines={},Qe.getTransfer(h)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=xn[g];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(y),e.render(f,m),y=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),c.dispose(),u.dispose(),d.dispose()}}var Cn=new y,wn=new Ct(1,1),Tn=new Ee,En=new Ot,Dn=new bt,On=[],kn=[],An=new Float32Array(16),jn=new Float32Array(9),Mn=new Float32Array(4);function Nn(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=On[i];if(a===void 0&&(a=new Float32Array(i),On[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Pn(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Fn(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function In(e,t){let n=kn[t];n===void 0&&(n=new Int32Array(t),kn[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Ln(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Rn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Pn(n,t))return;e.uniform2fv(this.addr,t),Fn(n,t)}}function zn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Pn(n,t))return;e.uniform3fv(this.addr,t),Fn(n,t)}}function Bn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Pn(n,t))return;e.uniform4fv(this.addr,t),Fn(n,t)}}function Vn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Pn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Fn(n,t)}else{if(Pn(n,r))return;Mn.set(r),e.uniformMatrix2fv(this.addr,!1,Mn),Fn(n,r)}}function Hn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Pn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Fn(n,t)}else{if(Pn(n,r))return;jn.set(r),e.uniformMatrix3fv(this.addr,!1,jn),Fn(n,r)}}function Un(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Pn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Fn(n,t)}else{if(Pn(n,r))return;An.set(r),e.uniformMatrix4fv(this.addr,!1,An),Fn(n,r)}}function Wn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Gn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Pn(n,t))return;e.uniform2iv(this.addr,t),Fn(n,t)}}function Kn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Pn(n,t))return;e.uniform3iv(this.addr,t),Fn(n,t)}}function qn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Pn(n,t))return;e.uniform4iv(this.addr,t),Fn(n,t)}}function Jn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Yn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Pn(n,t))return;e.uniform2uiv(this.addr,t),Fn(n,t)}}function Xn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Pn(n,t))return;e.uniform3uiv(this.addr,t),Fn(n,t)}}function Zn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Pn(n,t))return;e.uniform4uiv(this.addr,t),Fn(n,t)}}function Qn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(wn.compareFunction=n.isReversedDepthBuffer()?518:515,a=wn):a=Cn,n.setTexture2D(t||a,i)}function $n(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||En,i)}function er(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Dn,i)}function tr(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Tn,i)}function nr(e){switch(e){case 5126:return Ln;case 35664:return Rn;case 35665:return zn;case 35666:return Bn;case 35674:return Vn;case 35675:return Hn;case 35676:return Un;case 5124:case 35670:return Wn;case 35667:case 35671:return Gn;case 35668:case 35672:return Kn;case 35669:case 35673:return qn;case 5125:return Jn;case 36294:return Yn;case 36295:return Xn;case 36296:return Zn;case 35678:case 36198:case 36298:case 36306:case 35682:return Qn;case 35679:case 36299:case 36307:return $n;case 35680:case 36300:case 36308:case 36293:return er;case 36289:case 36303:case 36311:case 36292:return tr}}function rr(e,t){e.uniform1fv(this.addr,t)}function ir(e,t){let n=Nn(t,this.size,2);e.uniform2fv(this.addr,n)}function ar(e,t){let n=Nn(t,this.size,3);e.uniform3fv(this.addr,n)}function or(e,t){let n=Nn(t,this.size,4);e.uniform4fv(this.addr,n)}function sr(e,t){let n=Nn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function cr(e,t){let n=Nn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function lr(e,t){let n=Nn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function ur(e,t){e.uniform1iv(this.addr,t)}function dr(e,t){e.uniform2iv(this.addr,t)}function fr(e,t){e.uniform3iv(this.addr,t)}function pr(e,t){e.uniform4iv(this.addr,t)}function mr(e,t){e.uniform1uiv(this.addr,t)}function hr(e,t){e.uniform2uiv(this.addr,t)}function gr(e,t){e.uniform3uiv(this.addr,t)}function _r(e,t){e.uniform4uiv(this.addr,t)}function vr(e,t,n){let r=this.cache,i=t.length,a=In(n,i);Pn(r,a)||(e.uniform1iv(this.addr,a),Fn(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?wn:Cn;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function yr(e,t,n){let r=this.cache,i=t.length,a=In(n,i);Pn(r,a)||(e.uniform1iv(this.addr,a),Fn(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||En,a[e])}function br(e,t,n){let r=this.cache,i=t.length,a=In(n,i);Pn(r,a)||(e.uniform1iv(this.addr,a),Fn(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Dn,a[e])}function xr(e,t,n){let r=this.cache,i=t.length,a=In(n,i);Pn(r,a)||(e.uniform1iv(this.addr,a),Fn(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Tn,a[e])}function Sr(e){switch(e){case 5126:return rr;case 35664:return ir;case 35665:return ar;case 35666:return or;case 35674:return sr;case 35675:return cr;case 35676:return lr;case 5124:case 35670:return ur;case 35667:case 35671:return dr;case 35668:case 35672:return fr;case 35669:case 35673:return pr;case 5125:return mr;case 36294:return hr;case 36295:return gr;case 36296:return _r;case 35678:case 36198:case 36298:case 36306:case 35682:return vr;case 35679:case 36299:case 36307:return yr;case 35680:case 36300:case 36308:case 36293:return br;case 36289:case 36303:case 36311:case 36292:return xr}}var Cr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=nr(t.type)}},wr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Sr(t.type)}},Tr=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Er=/(\w+)(\])?(\[|\.)?/g;function Dr(e,t){e.seq.push(t),e.map[t.id]=t}function Or(e,t,n){let r=e.name,i=r.length;for(Er.lastIndex=0;;){let a=Er.exec(r),o=Er.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Dr(n,l===void 0?new Cr(s,e,t):new wr(s,e,t));break}else{let e=n.map[s];e===void 0&&(e=new Tr(s),Dr(n,e)),n=e}}}var kr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Or(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Ar(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var jr=37297,Mr=0;function Nr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Pr=new B;function Fr(e){Qe._getMatrix(Pr,Qe.workingColorSpace,e);let t=`mat3( ${Pr.elements.map(e=>e.toFixed(4))} )`;switch(Qe.getTransfer(e)){case nt:return[t,`LinearTransferOETF`];case Ke:return[t,`sRGBTransferOETF`];default:return W(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Ir(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Nr(e.getShaderSource(t),r)}else return i}function Lr(e,t){let n=Fr(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Rr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function zr(e,t){let n=Rr[t];return n===void 0?(W(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Br=new U;function Vr(){return Qe.getLuminanceCoefficients(Br),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Br.x.toFixed(4)}, ${Br.y.toFixed(4)}, ${Br.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Hr(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Gr).join(`
`)}function Ur(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Wr(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Gr(e){return e!==``}function Kr(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Jr=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yr(e){return e.replace(Jr,Zr)}var Xr=new Map;function Zr(e,t){let n=G[t];if(n===void 0){let e=Xr.get(t);if(e!==void 0)n=G[e],W(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Yr(n)}var Qr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $r(e){return e.replace(Qr,ei)}function ei(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ti(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var ni={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ri(e){return ni[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var ii={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function ai(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:ii[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var oi={302:`ENVMAP_MODE_REFRACTION`};function si(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:oi[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ci={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function li(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ci[e.combine]||`ENVMAP_BLENDING_NONE`}function ui(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function di(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ri(n),l=ai(n),u=si(n),d=li(n),f=ui(n),p=Hr(n),m=Ur(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Gr).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Gr).join(`
`),_.length>0&&(_+=`
`)):(g=[ti(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Gr).join(`
`),_=[ti(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:G.tonemapping_pars_fragment,n.toneMapping===0?``:zr(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,G.colorspace_pars_fragment,Lr(`linearToOutputTexel`,n.outputColorSpace),Vr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Gr).join(`
`)),o=Yr(o),o=Kr(o,n),o=qr(o,n),s=Yr(s),s=Kr(s,n),s=qr(s,n),o=$r(o),s=$r(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Ar(i,i.VERTEX_SHADER,y),S=Ar(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1)if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Ir(i,x,`vertex`),n=Ir(i,S,`fragment`);Ie(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}else o===``?(s===``||c===``)&&(u=!1):W(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new kr(i,h),T=Wr(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,jr)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Mr++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var fi=0,pi=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new mi(e),t.set(e,n)),n}},mi=class{constructor(e){this.id=fi++,this.code=e,this.usedTimes=0}};function hi(e){return e===1030||e===37490||e===36285}function gi(e,t,n,r,i,a){let o=new w,s=new pi,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&W(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=Lt[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),te=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,re=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,ce=!!i.normalMap,N=!!i.displacementMap,le=!!i.emissiveMap,P=!!i.metalnessMap,F=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=ue&&!!i.anisotropyMap,_e=de&&!!i.clearcoatMap,ve=de&&!!i.clearcoatNormalMap,ye=de&&!!i.clearcoatRoughnessMap,be=pe&&!!i.iridescenceMap,xe=pe&&!!i.iridescenceThicknessMap,Se=me&&!!i.sheenColorMap,Ce=me&&!!i.sheenRoughnessMap,we=!!i.specularMap,Te=!!i.specularColorMap,Ee=!!i.specularIntensityMap,De=he&&!!i.transmissionMap,Oe=he&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,Ne=!!i.extensions,Pe=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Pe=e.toneMapping);let I={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:te,instancingColor:te&&h.instanceColor!==null,instancingMorph:te&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Qe.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:re,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:ce,displacementMap:N,emissiveMap:le,normalMapObjectSpace:ce&&i.normalMapType===1,normalMapTangentSpace:ce&&i.normalMapType===0,packedNormalMap:ce&&i.normalMapType===0&&hi(i.normalMap.format),metalnessMap:P,roughnessMap:F,anisotropy:ue,anisotropyMap:ge,clearcoat:de,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,dispersion:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:xe,sheen:me,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:Te,specularIntensityMap:Ee,transmission:he,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:ce&&m(i.normalMap.channel),displacementMapUv:N&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:P&&m(i.metalnessMap.channel),roughnessMapUv:F&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&m(i.sheenRoughnessMap.channel),specularMapUv:we&&m(i.specularMap.channel),specularColorMapUv:Te&&m(i.specularColorMap.channel),specularIntensityMapUv:Ee&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:Oe&&m(i.thicknessMap.channel),alphaMapUv:Ae&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ce||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Ae),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ce===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&Qe.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ne&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ne&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return I.vertexUv1s=c.has(1),I.vertexUv2s=c.has(2),I.vertexUv3s=c.has(3),c.clear(),I}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Lt[t];n=lt.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new di(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function _i(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function vi(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function yi(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function bi(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||vi),r.length>1&&r.sort(t||yi),i.length>1&&i.sort(t||yi),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function xi(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new bi,e.set(t,[i])):n>=r.length?(i=new bi,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Si(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new U,color:new H};break;case`SpotLight`:n={position:new U,direction:new U,color:new H,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new U,color:new H,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new U,skyColor:new H,groundColor:new H};break;case`RectAreaLight`:n={color:new H,position:new U,halfWidth:new U,halfHeight:new U};break}return e[t.id]=n,n}}}function Ci(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var wi=0;function Ti(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ei(e){let t=new Si,n=Ci(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new U);let i=new U,a=new yt,o=new yt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Ti);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=K.LTC_FLOAT_1,r.rectAreaLTC2=K.LTC_FLOAT_2):(r.rectAreaLTC1=K.LTC_HALF_1,r.rectAreaLTC2=K.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=wi++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Di(e){let t=new Ei(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Oi(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Di(e),t.set(n,[a])):r>=i.length?(a=new Di(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var ki=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ai=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ji=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],Mi=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],Ni=new yt,Pi=new U,Fi=new U;function Ii(e,t,n){let r=new O,i=new V,a=new V,o=new Ue,s=new st,c=new et,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new A({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new V},radius:{value:4}},vertexShader:ki,fragmentShader:Ai}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let h=new _t;h.setAttribute(`position`,new Xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new Ne(h,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,s){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;this.type===2&&(W(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let m=v!==this.type;m&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){W(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let h=d.getFrameExtents();i.multiply(h),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/h.x),i.x=a.x*h.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/h.y),i.y=a.y*h.y,d.mapSize.y=a.y));let g=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=g,d.map===null||m===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){W(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new pt(i.x,i.y,{format:L,type:p,minFilter:re,magFilter:re,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Ct(i.x,i.y,Ge),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=se,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=St,d.map.depthTexture.magFilter=St}else l.isPointLight?(d.map=new pn(i.x),d.map.depthTexture=new ye(i.x,ie)):(d.map=new pt(i.x,i.y),d.map.depthTexture=new Ct(i.x,i.y,ie)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=se,this.type===1?(d.map.depthTexture.compareFunction=g?518:515,d.map.depthTexture.minFilter=re,d.map.depthTexture.magFilter=re):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=St,d.map.depthTexture.magFilter=St);d.camera.updateProjectionMatrix()}let _=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<_;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Pi.setFromMatrixPosition(l.matrixWorld),e.position.copy(Pi),Fi.copy(e.position),Fi.add(ji[t]),e.up.copy(Mi[t]),e.lookAt(Fi),e.updateMatrixWorld(),n.makeTranslation(-Pi.x,-Pi.y,-Pi.z),Ni.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Ni,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),x(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&y(d,s),d.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(c,l,d)};function y(n,r){let a=t.update(g);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new pt(i.x,i.y,{format:L,type:p})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],i,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Li(e,t){function n(){let t=!1,n=new Ue,r=null,i=new Ue(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?P(e.DEPTH_TEST):F(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=wt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?P(e.STENCIL_TEST):F(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new H(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,A=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),te=!1,M=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),te=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(ne)[1]),te=M>=1);let re=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Ue().fromArray(ae),ce=new Ue().fromArray(oe);function N(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=N(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=N(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=N(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=N(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),P(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),P(e.CULL_FACE),he(0);function P(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function F(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]===n?!1:(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h===t?!1:(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(F(e.BLEND),g=!1);return}if(g===!1&&(P(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ie(`WebGLState: Invalid blending: `,t);break}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Ie(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Ie(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Ie(`WebGLState: Invalid blending: `,t);break}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?F(e.CULL_FACE):P(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),be(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?P(e.SAMPLE_ALPHA_TO_COVERAGE):F(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?F(e.CULL_FACE):(P(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ye(t){t!==ee&&(te&&e.lineWidth(t),ee=t)}function be(t,n,r){t?(P(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(k=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):F(e.POLYGON_OFFSET_FILL)}function xe(t){t?P(e.SCISSOR_TEST):F(e.SCISSOR_TEST)}function Se(t){t===void 0&&(t=e.TEXTURE0+j-1),re!==t&&(e.activeTexture(t),re=t)}function Ce(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+j-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function we(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function Oe(){try{e.texSubImage3D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function je(){try{e.texStorage2D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function Me(){try{e.texStorage3D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function Ne(){try{e.texImage2D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){Ie(`WebGLState:`,e)}}function I(t){return d[t]===void 0?e.getParameter(t):d[t]}function Fe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Le(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Re(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function L(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ze(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function R(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new H(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,A=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:P,disable:F,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:ye,setPolygonOffset:be,setScissorTest:xe,activeTexture:Se,bindTexture:Ce,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:Ne,texImage3D:Pe,pixelStorei:Fe,getParameter:I,updateUBOMapping:L,uniformBlockBinding:ze,texStorage2D:je,texStorage3D:Me,texSubImage2D:De,texSubImage3D:Oe,compressedTexSubImage2D:ke,compressedTexSubImage3D:Ae,scissor:Le,viewport:Re,reset:R}}function Ri(t,n,r,i,a,o,l){let u=n.has(`WEBGL_multisampled_render_to_texture`)?n.get(`WEBGL_multisampled_render_to_texture`):null,d=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),f=new V,p=new WeakMap,m=new Set,h,g=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function v(e,t){return _?new OffscreenCanvas(e,t):Me(`canvas`)}function y(e,t,n){let r=1,i=je(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1)if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);h===void 0&&(h=v(n,a));let o=t?v(n,a):h;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),W(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}else return`data`in e&&W(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e;return e}function b(e){return e.generateMipmaps}function x(e){t.generateMipmap(e)}function S(e){return e.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?t.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function C(e,r,i,a,o,s=!1){if(e!==null){if(t[e]!==void 0)return t[e];W(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let c;a&&(c=n.get(`EXT_texture_norm16`),c||W(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===t.RED&&(i===t.FLOAT&&(l=t.R32F),i===t.HALF_FLOAT&&(l=t.R16F),i===t.UNSIGNED_BYTE&&(l=t.R8),i===t.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===t.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===t.RED_INTEGER&&(i===t.UNSIGNED_BYTE&&(l=t.R8UI),i===t.UNSIGNED_SHORT&&(l=t.R16UI),i===t.UNSIGNED_INT&&(l=t.R32UI),i===t.BYTE&&(l=t.R8I),i===t.SHORT&&(l=t.R16I),i===t.INT&&(l=t.R32I)),r===t.RG&&(i===t.FLOAT&&(l=t.RG32F),i===t.HALF_FLOAT&&(l=t.RG16F),i===t.UNSIGNED_BYTE&&(l=t.RG8),i===t.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===t.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===t.RG_INTEGER&&(i===t.UNSIGNED_BYTE&&(l=t.RG8UI),i===t.UNSIGNED_SHORT&&(l=t.RG16UI),i===t.UNSIGNED_INT&&(l=t.RG32UI),i===t.BYTE&&(l=t.RG8I),i===t.SHORT&&(l=t.RG16I),i===t.INT&&(l=t.RG32I)),r===t.RGB_INTEGER&&(i===t.UNSIGNED_BYTE&&(l=t.RGB8UI),i===t.UNSIGNED_SHORT&&(l=t.RGB16UI),i===t.UNSIGNED_INT&&(l=t.RGB32UI),i===t.BYTE&&(l=t.RGB8I),i===t.SHORT&&(l=t.RGB16I),i===t.INT&&(l=t.RGB32I)),r===t.RGBA_INTEGER&&(i===t.UNSIGNED_BYTE&&(l=t.RGBA8UI),i===t.UNSIGNED_SHORT&&(l=t.RGBA16UI),i===t.UNSIGNED_INT&&(l=t.RGBA32UI),i===t.BYTE&&(l=t.RGBA8I),i===t.SHORT&&(l=t.RGBA16I),i===t.INT&&(l=t.RGBA32I)),r===t.RGB&&(i===t.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===t.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===t.UNSIGNED_INT_5_9_9_9_REV&&(l=t.RGB9_E5),i===t.UNSIGNED_INT_10F_11F_11F_REV&&(l=t.R11F_G11F_B10F)),r===t.RGBA){let e=s?nt:Qe.getTransfer(o);i===t.FLOAT&&(l=t.RGBA32F),i===t.HALF_FLOAT&&(l=t.RGBA16F),i===t.UNSIGNED_BYTE&&(l=e===`srgb`?t.SRGB8_ALPHA8:t.RGBA8),i===t.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===t.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===t.UNSIGNED_SHORT_4_4_4_4&&(l=t.RGBA4),i===t.UNSIGNED_SHORT_5_5_5_1&&(l=t.RGB5_A1)}return(l===t.R16F||l===t.R32F||l===t.RG16F||l===t.RG32F||l===t.RGBA16F||l===t.RGBA32F)&&n.get(`EXT_color_buffer_float`),l}function w(e,n){let r;return e?n===null||n===1014||n===1020?r=t.DEPTH24_STENCIL8:n===1015?r=t.DEPTH32F_STENCIL8:n===1012&&(r=t.DEPTH24_STENCIL8,W(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=t.DEPTH_COMPONENT24:n===1015?r=t.DEPTH_COMPONENT32F:n===1012&&(r=t.DEPTH_COMPONENT16),r}function T(e,t){return b(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function E(e){let t=e.target;t.removeEventListener(`dispose`,E),O(t),t.isVideoTexture&&p.delete(t),t.isHTMLTexture&&m.delete(t)}function D(e){let t=e.target;t.removeEventListener(`dispose`,D),k(t)}function O(e){let t=i.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=g.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&ee(e),Object.keys(r).length===0&&g.delete(n)}i.remove(e)}function ee(e){let n=i.get(e);t.deleteTexture(n.__webglTexture);let r=e.source,a=g.get(r);delete a[n.__cacheKey],l.memory.textures--}function k(e){let n=i.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),i.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(n.__webglFramebuffer[e]))for(let r=0;r<n.__webglFramebuffer[e].length;r++)t.deleteFramebuffer(n.__webglFramebuffer[e][r]);else t.deleteFramebuffer(n.__webglFramebuffer[e]);n.__webglDepthbuffer&&t.deleteRenderbuffer(n.__webglDepthbuffer[e])}else{if(Array.isArray(n.__webglFramebuffer))for(let e=0;e<n.__webglFramebuffer.length;e++)t.deleteFramebuffer(n.__webglFramebuffer[e]);else t.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&t.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&t.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let e=0;e<n.__webglColorRenderbuffer.length;e++)n.__webglColorRenderbuffer[e]&&t.deleteRenderbuffer(n.__webglColorRenderbuffer[e]);n.__webglDepthRenderbuffer&&t.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=e.textures;for(let e=0,n=r.length;e<n;e++){let n=i.get(r[e]);n.__webglTexture&&(t.deleteTexture(n.__webglTexture),l.memory.textures--),i.remove(r[e])}i.remove(e)}let A=0;function j(){A=0}function te(){return A}function M(e){A=e}function ne(){let e=A;return e>=a.maxTextures&&W(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+a.maxTextures),A+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(e,n){let a=i.get(e);if(e.isVideoTexture&&ke(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&a.__version!==e.version){let t=e.image;if(t===null)W(`WebGLRenderer: Texture marked for update but no image data found.`);else if(t.complete===!1)W(`WebGLRenderer: Texture marked for update but image is incomplete`);else{pe(a,e,n);return}}else e.isExternalTexture&&(a.__webglTexture=e.sourceTexture?e.sourceTexture:null);r.bindTexture(t.TEXTURE_2D,a.__webglTexture,t.TEXTURE0+n)}function oe(e,n){let a=i.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&a.__version!==e.version){pe(a,e,n);return}else e.isExternalTexture&&(a.__webglTexture=e.sourceTexture?e.sourceTexture:null);r.bindTexture(t.TEXTURE_2D_ARRAY,a.__webglTexture,t.TEXTURE0+n)}function se(e,n){let a=i.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&a.__version!==e.version){pe(a,e,n);return}r.bindTexture(t.TEXTURE_3D,a.__webglTexture,t.TEXTURE0+n)}function ce(e,n){let a=i.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&a.__version!==e.version){me(a,e,n);return}r.bindTexture(t.TEXTURE_CUBE_MAP,a.__webglTexture,t.TEXTURE0+n)}let N={[c]:t.REPEAT,[Fe]:t.CLAMP_TO_EDGE,[Se]:t.MIRRORED_REPEAT},le={[St]:t.NEAREST,[Oe]:t.NEAREST_MIPMAP_NEAREST,[jt]:t.NEAREST_MIPMAP_LINEAR,[re]:t.LINEAR,[I]:t.LINEAR_MIPMAP_NEAREST,[e]:t.LINEAR_MIPMAP_LINEAR},P={512:t.NEVER,519:t.ALWAYS,513:t.LESS,515:t.LEQUAL,514:t.EQUAL,518:t.GEQUAL,516:t.GREATER,517:t.NOTEQUAL};function F(e,r){if(r.type===1015&&n.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&W(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),t.texParameteri(e,t.TEXTURE_WRAP_S,N[r.wrapS]),t.texParameteri(e,t.TEXTURE_WRAP_T,N[r.wrapT]),(e===t.TEXTURE_3D||e===t.TEXTURE_2D_ARRAY)&&t.texParameteri(e,t.TEXTURE_WRAP_R,N[r.wrapR]),t.texParameteri(e,t.TEXTURE_MAG_FILTER,le[r.magFilter]),t.texParameteri(e,t.TEXTURE_MIN_FILTER,le[r.minFilter]),r.compareFunction&&(t.texParameteri(e,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(e,t.TEXTURE_COMPARE_FUNC,P[r.compareFunction])),n.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&n.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){let o=n.get(`EXT_texture_filter_anisotropic`);t.texParameterf(e,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,a.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function ue(e,n){let r=!1;e.__webglInit===void 0&&(e.__webglInit=!0,n.addEventListener(`dispose`,E));let i=n.source,a=g.get(i);a===void 0&&(a={},g.set(i,a));let o=ie(n);if(o!==e.__cacheKey){a[o]===void 0&&(a[o]={texture:t.createTexture(),usedTimes:0},l.memory.textures++,r=!0),a[o].usedTimes++;let i=a[e.__cacheKey];i!==void 0&&(a[e.__cacheKey].usedTimes--,i.usedTimes===0&&ee(n)),e.__cacheKey=o,e.__webglTexture=a[o].texture}return r}function de(e,t,n){return Math.floor(Math.floor(e/n)/t)}function fe(e,n,i,a){let o=e.updateRanges;if(o.length===0)r.texSubImage2D(t.TEXTURE_2D,0,0,0,n.width,n.height,i,a,n.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],r=o[e],i=t.start+t.count,a=de(r.start,n.width,4),c=de(t.start,n.width,4);r.start<=i+1&&a===c&&de(r.start+r.count-1,n.width,4)===a?t.count=Math.max(t.count,r.start+r.count-t.start):(++s,o[s]=r)}o.length=s+1;let c=r.getParameter(t.UNPACK_ROW_LENGTH),l=r.getParameter(t.UNPACK_SKIP_PIXELS),u=r.getParameter(t.UNPACK_SKIP_ROWS);r.pixelStorei(t.UNPACK_ROW_LENGTH,n.width);for(let e=0,s=o.length;e<s;e++){let s=o[e],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%n.width,d=Math.floor(c/n.width),f=l;r.pixelStorei(t.UNPACK_SKIP_PIXELS,u),r.pixelStorei(t.UNPACK_SKIP_ROWS,d),r.texSubImage2D(t.TEXTURE_2D,0,u,d,f,1,i,a,n.data)}e.clearUpdateRanges(),r.pixelStorei(t.UNPACK_ROW_LENGTH,c),r.pixelStorei(t.UNPACK_SKIP_PIXELS,l),r.pixelStorei(t.UNPACK_SKIP_ROWS,u)}}function pe(e,n,c){let l=t.TEXTURE_2D;(n.isDataArrayTexture||n.isCompressedArrayTexture)&&(l=t.TEXTURE_2D_ARRAY),n.isData3DTexture&&(l=t.TEXTURE_3D);let u=ue(e,n),d=n.source;r.bindTexture(l,e.__webglTexture,t.TEXTURE0+c);let f=i.get(d);if(d.version!==f.__version||u===!0){if(r.activeTexture(t.TEXTURE0+c),!(typeof ImageBitmap<`u`&&n.image instanceof ImageBitmap)){let e=Qe.getPrimaries(Qe.workingColorSpace),i=n.colorSpace===``?null:Qe.getPrimaries(n.colorSpace),a=n.colorSpace===``||e===i?t.NONE:t.BROWSER_DEFAULT_WEBGL;r.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,n.flipY),r.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),r.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}r.pixelStorei(t.UNPACK_ALIGNMENT,n.unpackAlignment);let e=y(n.image,!1,a.maxTextureSize);e=Ae(n,e);let i=o.convert(n.format,n.colorSpace),p=o.convert(n.type),h=C(n.internalFormat,i,p,n.normalized,n.colorSpace,n.isVideoTexture);F(l,n);let g,_=n.mipmaps,v=n.isVideoTexture!==!0,S=f.__version===void 0||u===!0,E=d.dataReady,D=T(n,e);if(n.isDepthTexture)h=w(n.format===s,n.type),S&&(v?r.texStorage2D(t.TEXTURE_2D,1,h,e.width,e.height):r.texImage2D(t.TEXTURE_2D,0,h,e.width,e.height,0,i,p,null));else if(n.isDataTexture)if(_.length>0){v&&S&&r.texStorage2D(t.TEXTURE_2D,D,h,_[0].width,_[0].height);for(let e=0,n=_.length;e<n;e++)g=_[e],v?E&&r.texSubImage2D(t.TEXTURE_2D,e,0,0,g.width,g.height,i,p,g.data):r.texImage2D(t.TEXTURE_2D,e,h,g.width,g.height,0,i,p,g.data);n.generateMipmaps=!1}else v?(S&&r.texStorage2D(t.TEXTURE_2D,D,h,e.width,e.height),E&&fe(n,e,i,p)):r.texImage2D(t.TEXTURE_2D,0,h,e.width,e.height,0,i,p,e.data);else if(n.isCompressedTexture)if(n.isCompressedArrayTexture){v&&S&&r.texStorage3D(t.TEXTURE_2D_ARRAY,D,h,_[0].width,_[0].height,e.depth);for(let a=0,o=_.length;a<o;a++)if(g=_[a],n.format!==1023)if(i!==null)if(v){if(E)if(n.layerUpdates.size>0){let e=ot(g.width,g.height,n.format,n.type);for(let o of n.layerUpdates){let n=g.data.subarray(o*e/g.data.BYTES_PER_ELEMENT,(o+1)*e/g.data.BYTES_PER_ELEMENT);r.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,a,0,0,o,g.width,g.height,1,i,n)}n.clearLayerUpdates()}else r.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,a,0,0,0,g.width,g.height,e.depth,i,g.data)}else r.compressedTexImage3D(t.TEXTURE_2D_ARRAY,a,h,g.width,g.height,e.depth,0,g.data,0,0);else W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);else v?E&&r.texSubImage3D(t.TEXTURE_2D_ARRAY,a,0,0,0,g.width,g.height,e.depth,i,p,g.data):r.texImage3D(t.TEXTURE_2D_ARRAY,a,h,g.width,g.height,e.depth,0,i,p,g.data)}else{v&&S&&r.texStorage2D(t.TEXTURE_2D,D,h,_[0].width,_[0].height);for(let e=0,a=_.length;e<a;e++)g=_[e],n.format===1023?v?E&&r.texSubImage2D(t.TEXTURE_2D,e,0,0,g.width,g.height,i,p,g.data):r.texImage2D(t.TEXTURE_2D,e,h,g.width,g.height,0,i,p,g.data):i===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):v?E&&r.compressedTexSubImage2D(t.TEXTURE_2D,e,0,0,g.width,g.height,i,g.data):r.compressedTexImage2D(t.TEXTURE_2D,e,h,g.width,g.height,0,g.data)}else if(n.isDataArrayTexture)if(v){if(S&&r.texStorage3D(t.TEXTURE_2D_ARRAY,D,h,e.width,e.height,e.depth),E)if(n.layerUpdates.size>0){let a=ot(e.width,e.height,n.format,n.type);for(let o of n.layerUpdates){let n=e.data.subarray(o*a/e.data.BYTES_PER_ELEMENT,(o+1)*a/e.data.BYTES_PER_ELEMENT);r.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,o,e.width,e.height,1,i,p,n)}n.clearLayerUpdates()}else r.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,i,p,e.data)}else r.texImage3D(t.TEXTURE_2D_ARRAY,0,h,e.width,e.height,e.depth,0,i,p,e.data);else if(n.isData3DTexture)v?(S&&r.texStorage3D(t.TEXTURE_3D,D,h,e.width,e.height,e.depth),E&&r.texSubImage3D(t.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,i,p,e.data)):r.texImage3D(t.TEXTURE_3D,0,h,e.width,e.height,e.depth,0,i,p,e.data);else if(n.isFramebufferTexture){if(S)if(v)r.texStorage2D(t.TEXTURE_2D,D,h,e.width,e.height);else{let n=e.width,a=e.height;for(let e=0;e<D;e++)r.texImage2D(t.TEXTURE_2D,e,h,n,a,0,i,p,null),n>>=1,a>>=1}}else if(n.isHTMLTexture){if(`texElementImage2D`in t){let r=t.canvas;if(r.hasAttribute(`layoutsubtree`)||r.setAttribute(`layoutsubtree`,`true`),e.parentNode!==r){r.appendChild(e),m.add(n),r.onpaint=e=>{let t=e.changedElements;for(let e of m)t.includes(e.image)&&(e.needsUpdate=!0)},r.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,e);else{let n=t.RGBA,r=t.RGBA,i=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,n,r,i,e)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(_.length>0){if(v&&S){let e=je(_[0]);r.texStorage2D(t.TEXTURE_2D,D,h,e.width,e.height)}for(let e=0,n=_.length;e<n;e++)g=_[e],v?E&&r.texSubImage2D(t.TEXTURE_2D,e,0,0,i,p,g):r.texImage2D(t.TEXTURE_2D,e,h,i,p,g);n.generateMipmaps=!1}else if(v){if(S){let n=je(e);r.texStorage2D(t.TEXTURE_2D,D,h,n.width,n.height)}E&&r.texSubImage2D(t.TEXTURE_2D,0,0,0,i,p,e)}else r.texImage2D(t.TEXTURE_2D,0,h,i,p,e);b(n)&&x(l),f.__version=d.version,n.onUpdate&&n.onUpdate(n)}e.__version=n.version}function me(e,n,s){if(n.image.length!==6)return;let c=ue(e,n),l=n.source;r.bindTexture(t.TEXTURE_CUBE_MAP,e.__webglTexture,t.TEXTURE0+s);let u=i.get(l);if(l.version!==u.__version||c===!0){r.activeTexture(t.TEXTURE0+s);let e=Qe.getPrimaries(Qe.workingColorSpace),i=n.colorSpace===``?null:Qe.getPrimaries(n.colorSpace),d=n.colorSpace===``||e===i?t.NONE:t.BROWSER_DEFAULT_WEBGL;r.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,n.flipY),r.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),r.pixelStorei(t.UNPACK_ALIGNMENT,n.unpackAlignment),r.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=n.isCompressedTexture||n.image[0].isCompressedTexture,p=n.image[0]&&n.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=y(n.image[e],!0,a.maxCubemapSize):m[e]=p?n.image[e].image:n.image[e],m[e]=Ae(n,m[e]);let h=m[0],g=o.convert(n.format,n.colorSpace),_=o.convert(n.type),v=C(n.internalFormat,g,_,n.normalized,n.colorSpace),S=n.isVideoTexture!==!0,w=u.__version===void 0||c===!0,E=l.dataReady,D=T(n,h);F(t.TEXTURE_CUBE_MAP,n);let O;if(f){S&&w&&r.texStorage2D(t.TEXTURE_CUBE_MAP,D,v,h.width,h.height);for(let e=0;e<6;e++){O=m[e].mipmaps;for(let i=0;i<O.length;i++){let a=O[i];n.format===1023?S?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,0,0,a.width,a.height,g,_,a.data):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,v,a.width,a.height,0,g,_,a.data):g===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):S?E&&r.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,0,0,a.width,a.height,g,a.data):r.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,i,v,a.width,a.height,0,a.data)}}}else{if(O=n.mipmaps,S&&w){O.length>0&&D++;let e=je(m[0]);r.texStorage2D(t.TEXTURE_CUBE_MAP,D,v,e.width,e.height)}for(let e=0;e<6;e++)if(p){S?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,m[e].width,m[e].height,g,_,m[e].data):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,m[e].width,m[e].height,0,g,_,m[e].data);for(let n=0;n<O.length;n++){let i=O[n].image[e].image;S?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,0,0,i.width,i.height,g,_,i.data):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,v,i.width,i.height,0,g,_,i.data)}}else{S?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,m[e]):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,m[e]);for(let n=0;n<O.length;n++){let i=O[n];S?E&&r.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,0,0,g,_,i.image[e]):r.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+e,n+1,v,g,_,i.image[e])}}}b(n)&&x(t.TEXTURE_CUBE_MAP),u.__version=l.version,n.onUpdate&&n.onUpdate(n)}e.__version=n.version}function he(e,n,a,s,c,l){let d=o.convert(a.format,a.colorSpace),f=o.convert(a.type),p=C(a.internalFormat,d,f,a.normalized,a.colorSpace),m=i.get(n),h=i.get(a);if(h.__renderTarget=n,!m.__hasExternalTextures){let e=Math.max(1,n.width>>l),i=Math.max(1,n.height>>l);c===t.TEXTURE_3D||c===t.TEXTURE_2D_ARRAY?r.texImage3D(c,l,p,e,i,n.depth,0,d,f,null):r.texImage2D(c,l,p,e,i,0,d,f,null)}r.bindFramebuffer(t.FRAMEBUFFER,e),De(n)?u.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,s,c,h.__webglTexture,0,Ee(n)):(c===t.TEXTURE_2D||c>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&c<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,s,c,h.__webglTexture,l),r.bindFramebuffer(t.FRAMEBUFFER,null)}function ge(e,n,r){if(t.bindRenderbuffer(t.RENDERBUFFER,e),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=w(n.stencilBuffer,a),s=n.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;De(n)?u.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ee(n),o,n.width,n.height):r?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ee(n),o,n.width,n.height):t.renderbufferStorage(t.RENDERBUFFER,o,n.width,n.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,s,t.RENDERBUFFER,e)}else{let e=n.textures;for(let i=0;i<e.length;i++){let a=e[i],s=o.convert(a.format,a.colorSpace),c=o.convert(a.type),l=C(a.internalFormat,s,c,a.normalized,a.colorSpace);De(n)?u.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ee(n),l,n.width,n.height):r?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ee(n),l,n.width,n.height):t.renderbufferStorage(t.RENDERBUFFER,l,n.width,n.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function _e(e,n,a){let s=n.isWebGLCubeRenderTarget===!0;if(r.bindFramebuffer(t.FRAMEBUFFER,e),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=i.get(n.depthTexture);if(c.__renderTarget=n,(!c.__webglTexture||n.depthTexture.image.width!==n.width||n.depthTexture.image.height!==n.height)&&(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),s){if(c.__webglInit===void 0&&(c.__webglInit=!0,n.depthTexture.addEventListener(`dispose`,E)),c.__webglTexture===void 0){c.__webglTexture=t.createTexture(),r.bindTexture(t.TEXTURE_CUBE_MAP,c.__webglTexture),F(t.TEXTURE_CUBE_MAP,n.depthTexture);let e=o.convert(n.depthTexture.format),i=o.convert(n.depthTexture.type),a;n.depthTexture.format===1026?a=t.DEPTH_COMPONENT24:n.depthTexture.format===1027&&(a=t.DEPTH24_STENCIL8);for(let r=0;r<6;r++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,a,n.width,n.height,0,e,i,null)}}else ae(n.depthTexture,0);let l=c.__webglTexture,d=Ee(n),f=s?t.TEXTURE_CUBE_MAP_POSITIVE_X+a:t.TEXTURE_2D,p=n.depthTexture.format===1027?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(n.depthTexture.format===1026)De(n)?u.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,p,f,l,0,d):t.framebufferTexture2D(t.FRAMEBUFFER,p,f,l,0);else if(n.depthTexture.format===1027)De(n)?u.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,p,f,l,0,d):t.framebufferTexture2D(t.FRAMEBUFFER,p,f,l,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ve(e){let n=i.get(e),a=e.isWebGLCubeRenderTarget===!0;if(n.__boundDepthTexture!==e.depthTexture){let t=e.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),t){let e=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,t.removeEventListener(`dispose`,e)};t.addEventListener(`dispose`,e),n.__depthDisposeCallback=e}n.__boundDepthTexture=t}if(e.depthTexture&&!n.__autoAllocateDepthBuffer)if(a)for(let t=0;t<6;t++)_e(n.__webglFramebuffer[t],e,t);else{let t=e.texture.mipmaps;t&&t.length>0?_e(n.__webglFramebuffer[0],e,0):_e(n.__webglFramebuffer,e,0)}else if(a){n.__webglDepthbuffer=[];for(let i=0;i<6;i++)if(r.bindFramebuffer(t.FRAMEBUFFER,n.__webglFramebuffer[i]),n.__webglDepthbuffer[i]===void 0)n.__webglDepthbuffer[i]=t.createRenderbuffer(),ge(n.__webglDepthbuffer[i],e,!1);else{let r=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer[i];t.bindRenderbuffer(t.RENDERBUFFER,a),t.framebufferRenderbuffer(t.FRAMEBUFFER,r,t.RENDERBUFFER,a)}}else{let i=e.texture.mipmaps;if(i&&i.length>0?r.bindFramebuffer(t.FRAMEBUFFER,n.__webglFramebuffer[0]):r.bindFramebuffer(t.FRAMEBUFFER,n.__webglFramebuffer),n.__webglDepthbuffer===void 0)n.__webglDepthbuffer=t.createRenderbuffer(),ge(n.__webglDepthbuffer,e,!1);else{let r=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,i=n.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,i),t.framebufferRenderbuffer(t.FRAMEBUFFER,r,t.RENDERBUFFER,i)}}r.bindFramebuffer(t.FRAMEBUFFER,null)}function ye(e,n,r){let a=i.get(e);n!==void 0&&he(a.__webglFramebuffer,e,e.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),r!==void 0&&ve(e)}function be(e){let n=e.texture,a=i.get(e),s=i.get(n);e.addEventListener(`dispose`,D);let c=e.textures,u=e.isWebGLCubeRenderTarget===!0,d=c.length>1;if(d||(s.__webglTexture===void 0&&(s.__webglTexture=t.createTexture()),s.__version=n.version,l.memory.textures++),u){a.__webglFramebuffer=[];for(let e=0;e<6;e++)if(n.mipmaps&&n.mipmaps.length>0){a.__webglFramebuffer[e]=[];for(let r=0;r<n.mipmaps.length;r++)a.__webglFramebuffer[e][r]=t.createFramebuffer()}else a.__webglFramebuffer[e]=t.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){a.__webglFramebuffer=[];for(let e=0;e<n.mipmaps.length;e++)a.__webglFramebuffer[e]=t.createFramebuffer()}else a.__webglFramebuffer=t.createFramebuffer();if(d)for(let e=0,n=c.length;e<n;e++){let n=i.get(c[e]);n.__webglTexture===void 0&&(n.__webglTexture=t.createTexture(),l.memory.textures++)}if(e.samples>0&&De(e)===!1){a.__webglMultisampledFramebuffer=t.createFramebuffer(),a.__webglColorRenderbuffer=[],r.bindFramebuffer(t.FRAMEBUFFER,a.__webglMultisampledFramebuffer);for(let n=0;n<c.length;n++){let r=c[n];a.__webglColorRenderbuffer[n]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,a.__webglColorRenderbuffer[n]);let i=o.convert(r.format,r.colorSpace),s=o.convert(r.type),l=C(r.internalFormat,i,s,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),u=Ee(e);t.renderbufferStorageMultisample(t.RENDERBUFFER,u,l,e.width,e.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+n,t.RENDERBUFFER,a.__webglColorRenderbuffer[n])}t.bindRenderbuffer(t.RENDERBUFFER,null),e.depthBuffer&&(a.__webglDepthRenderbuffer=t.createRenderbuffer(),ge(a.__webglDepthRenderbuffer,e,!0)),r.bindFramebuffer(t.FRAMEBUFFER,null)}}if(u){r.bindTexture(t.TEXTURE_CUBE_MAP,s.__webglTexture),F(t.TEXTURE_CUBE_MAP,n);for(let r=0;r<6;r++)if(n.mipmaps&&n.mipmaps.length>0)for(let i=0;i<n.mipmaps.length;i++)he(a.__webglFramebuffer[r][i],e,n,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else he(a.__webglFramebuffer[r],e,n,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);b(n)&&x(t.TEXTURE_CUBE_MAP),r.unbindTexture()}else if(d){for(let n=0,o=c.length;n<o;n++){let o=c[n],s=i.get(o),l=t.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(l=e.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),r.bindTexture(l,s.__webglTexture),F(l,o),he(a.__webglFramebuffer,e,o,t.COLOR_ATTACHMENT0+n,l,0),b(o)&&x(l)}r.unbindTexture()}else{let i=t.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),r.bindTexture(i,s.__webglTexture),F(i,n),n.mipmaps&&n.mipmaps.length>0)for(let r=0;r<n.mipmaps.length;r++)he(a.__webglFramebuffer[r],e,n,t.COLOR_ATTACHMENT0,i,r);else he(a.__webglFramebuffer,e,n,t.COLOR_ATTACHMENT0,i,0);b(n)&&x(i),r.unbindTexture()}e.depthBuffer&&ve(e)}function xe(e){let t=e.textures;for(let n=0,a=t.length;n<a;n++){let a=t[n];if(b(a)){let t=S(e),n=i.get(a).__webglTexture;r.bindTexture(t,n),x(t),r.unbindTexture()}}}let Ce=[],we=[];function Te(e){if(e.samples>0){if(De(e)===!1){let n=e.textures,a=e.width,o=e.height,s=t.COLOR_BUFFER_BIT,c=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,l=i.get(e),u=n.length>1;if(u)for(let e=0;e<n.length;e++)r.bindFramebuffer(t.FRAMEBUFFER,l.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.RENDERBUFFER,null),r.bindFramebuffer(t.FRAMEBUFFER,l.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.TEXTURE_2D,null,0);r.bindFramebuffer(t.READ_FRAMEBUFFER,l.__webglMultisampledFramebuffer);let f=e.texture.mipmaps;f&&f.length>0?r.bindFramebuffer(t.DRAW_FRAMEBUFFER,l.__webglFramebuffer[0]):r.bindFramebuffer(t.DRAW_FRAMEBUFFER,l.__webglFramebuffer);for(let r=0;r<n.length;r++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(s|=t.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(s|=t.STENCIL_BUFFER_BIT)),u){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,l.__webglColorRenderbuffer[r]);let e=i.get(n[r]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0)}t.blitFramebuffer(0,0,a,o,0,0,a,o,s,t.NEAREST),d===!0&&(Ce.length=0,we.length=0,Ce.push(t.COLOR_ATTACHMENT0+r),e.depthBuffer&&e.resolveDepthBuffer===!1&&(Ce.push(c),we.push(c),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,we)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ce))}if(r.bindFramebuffer(t.READ_FRAMEBUFFER,null),r.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),u)for(let e=0;e<n.length;e++){r.bindFramebuffer(t.FRAMEBUFFER,l.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.RENDERBUFFER,l.__webglColorRenderbuffer[e]);let a=i.get(n[e]).__webglTexture;r.bindFramebuffer(t.FRAMEBUFFER,l.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+e,t.TEXTURE_2D,a,0)}r.bindFramebuffer(t.DRAW_FRAMEBUFFER,l.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.resolveDepthBuffer===!1&&d){let n=e.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[n])}}}function Ee(e){return Math.min(a.maxSamples,e.samples)}function De(e){let t=i.get(e);return e.samples>0&&n.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function ke(e){let t=l.render.frame;p.get(e)!==t&&(p.set(e,t),e.update())}function Ae(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Qe.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&W(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Ie(`WebGLTextures: Unsupported texture color space:`,n)),t}function je(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(f.width=e.naturalWidth||e.width,f.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(f.width=e.displayWidth,f.height=e.displayHeight):(f.width=e.width,f.height=e.height),f}this.allocateTextureUnit=ne,this.resetTextureUnits=j,this.getTextureUnits=te,this.setTextureUnits=M,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=ye,this.setupRenderTarget=be,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=he,this.useMultisampledRTT=De,this.isReversedDepthBuffer=function(){return r.buffers.depth.getReversed()}}function zi(e,t){function n(n,r=``){let i,a=Qe.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===`srgb`)if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Bi=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Vi=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Hi=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new te(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new A({vertexShader:Bi,fragmentShader:Vi,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ne(new f(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ui=class extends u{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,c=1,l=null,u=null,d=null,f=null,p=null,m=null,g=typeof XRWebGLBinding<`u`,_=new Hi,v={},y=t.getContextAttributes(),b=null,x=null,S=[],w=[],T=new V,E=null,D=new Tt;D.viewport=new Ue;let O=new Tt;O.viewport=new Ue;let ee=[D,O],k=new He,A=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=S[e];return t===void 0&&(t=new Ae,S[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=S[e];return t===void 0&&(t=new Ae,S[e]=t),t.getGripSpace()},this.getHand=function(e){let t=S[e];return t===void 0&&(t=new Ae,S[e]=t),t.getHandSpace()};function M(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=S[t];n!==void 0&&(n.update(e.inputSource,e.frame,l||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,M),r.removeEventListener(`selectstart`,M),r.removeEventListener(`selectend`,M),r.removeEventListener(`squeeze`,M),r.removeEventListener(`squeezestart`,M),r.removeEventListener(`squeezeend`,M),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,re);for(let e=0;e<S.length;e++){let t=w[e];t!==null&&(w[e]=null,S[e].disconnect(t))}A=null,j=null,_.reset();for(let e in v)delete v[e];e.setRenderTarget(b),p=null,f=null,d=null,r=null,x=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(e){l=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,M),r.addEventListener(`selectstart`,M),r.addEventListener(`selectend`,M),r.addEventListener(`squeeze`,M),r.addEventListener(`squeezestart`,M),r.addEventListener(`squeezeend`,M),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,re),y.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?s:se,a=y.stencil?ge:ie);let c={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(c),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new pt(f.textureWidth,f.textureHeight,{format:Pt,type:C,depthTexture:new Ct(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new pt(p.framebufferWidth,p.framebufferHeight,{format:Pt,type:C,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function re(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,S[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<S.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=S[r];i&&i.connect(n)}}let ae=new U,oe=new U;function ce(e,t,n){ae.setFromMatrixPosition(t.matrixWorld),oe.setFromMatrixPosition(n.matrixWorld);let r=ae.distanceTo(oe),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function N(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),k.near=O.near=D.near=t,k.far=O.far=D.far=n,(A!==k.near||j!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),A=k.near,j=k.far),k.layers.mask=e.layers.mask|6,D.layers.mask=k.layers.mask&-5,O.layers.mask=k.layers.mask&-3;let i=e.parent,a=k.cameras;N(k,i);for(let e=0;e<a.length;e++)N(a[e],i);a.length===2?ce(k,D,O):k.projectionMatrix.copy(D.projectionMatrix),le(e,k,i)};function le(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=h*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(e){c=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(k)},this.getCameraTexture=function(e){return v[e]};let P=null;function F(t,i){if(u=i.getViewerPose(l||a),m=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==k.cameras.length&&(k.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=ee[n];o===void 0&&(o=new Tt,o.layers.enable(n),o.viewport=new Ue,ee[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(k.matrix.copy(o.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),i===!0&&k.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new te,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<S.length;e++){let t=w[e],n=S[e];t!==null&&n!==void 0&&n.update(t,i,l||a)}P&&P(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let ue=new Ft;ue.setAnimationLoop(F),this.setAnimationLoop=function(e){P=e},this.dispose=function(){}}},Wi=new yt,Gi=new B;Gi.set(-1,0,0,0,1,0,0,0,1);function Ki(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,$e(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Wi.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Gi),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function qi(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return Ie(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return typeof i==`number`||typeof i==`boolean`?r[a]=i:ArrayBuffer.isView(i)?r[a]=i.slice():r[a]=i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?W(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):W(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Ji=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Yi=null;function Xi(){return Yi===null&&(Yi=new Et(Ji,16,16,L,p),Yi.name=`DFG_LUT`,Yi.minFilter=re,Yi.magFilter=re,Yi.wrapS=Fe,Yi.wrapT=Fe,Yi.generateMipmaps=!1,Yi.needsUpdate=!0),Yi}var Zi=class{constructor(n={}){let{canvas:i=vt(),context:a=null,depth:s=!0,stencil:c=!1,alpha:l=!1,antialias:u=!1,premultipliedAlpha:d=!0,preserveDrawingBuffer:f=!1,powerPreference:m=`default`,failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:g=!1,outputBufferType:_=C}=n;this.isWebGLRenderer=!0;let v;if(a!==null){if(typeof WebGLRenderingContext<`u`&&a instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);v=a.getContextAttributes().alpha}else v=l;let y=_,b=new Set([o,be,ce]),x=new Set([C,ie,ht,ge,t,Pe]),S=new Uint32Array(4),w=new Int32Array(4),T=new U,E=null,D=null,ee=[],k=[],A=null;this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let j=this,te=!1,M=null,ne=null,re=null,ae=null;this._outputColorSpace=r;let oe=0,se=0,N=null,le=-1,P=null,F=new Ue,ue=new Ue,de=null,fe=new H(0),pe=0,me=i.width,he=i.height,_e=1,ve=null,ye=null,Se=new Ue(0,0,me,he),Ce=new Ue(0,0,me,he),we=!1,Te=new O,Ee=!1,De=!1,Oe=new yt,ke=new U,Ae=new Ue,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return N===null?_e:1}let I=a;function Fe(e,t){return i.getContext(e,t)}try{let e={alpha:!0,depth:s,stencil:c,antialias:u,premultipliedAlpha:d,preserveDrawingBuffer:f,powerPreference:m,failIfMajorPerformanceCaveat:h};if(`setAttribute`in i&&i.setAttribute(`data-engine`,`three.js r185`),i.addEventListener(`webglcontextlost`,st,!1),i.addEventListener(`webglcontextrestored`,ct,!1),i.addEventListener(`webglcontextcreationerror`,lt,!1),I===null){let t=`webgl2`;if(I=Fe(t,e),I===null)throw Fe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw Ie(`WebGLRenderer: `+e.message),e}let Le,Re,L,ze,R,z,Ve,He,We,Ge,Ke,qe,Je,Ye,Xe,Ze,B,$e,et,tt,V,nt,rt;function at(){Le=new hn(I),Le.init(),V=new zi(I,Le),Re=new Wt(I,Le,n,V),L=new Li(I,Le),Re.reversedDepthBuffer&&g&&L.buffers.depth.setReversed(!0),ne=I.createFramebuffer(),re=I.createFramebuffer(),ae=I.createFramebuffer(),ze=new vn(I),R=new _i,z=new Ri(I,Le,L,R,Re,V,ze),Ve=new mn(j),He=new It(I),nt=new Ht(I,He),We=new gn(I,He,ze,nt),Ge=new bn(I,We,He,nt,ze),$e=new yn(I,Re,z),Xe=new Gt(R),Ke=new gi(j,Ve,Le,Re,nt,Xe),qe=new Ki(j,R),Je=new xi,Ye=new Oi(Le),B=new Vt(j,Ve,L,Ge,v,d),Ze=new Ii(j,Ge,Re),rt=new qi(I,ze,Re,L),et=new Ut(I,Le,ze),tt=new _n(I,Le,ze),ze.programs=Ke.programs,j.capabilities=Re,j.extensions=Le,j.properties=R,j.renderLists=Je,j.shadowMap=Ze,j.state=L,j.info=ze}at(),y!==1009&&(A=new Sn(y,i.width,i.height,u,s,c));let ot=new Ui(j,I);this.xr=ot,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(e){e!==void 0&&(_e=e,this.setSize(me,he,!1))},this.getSize=function(e){return e.set(me,he)},this.setSize=function(e,t,n=!0){if(ot.isPresenting){W(`WebGLRenderer: Can't change size while VR device is presenting.`);return}me=e,he=t,i.width=Math.floor(e*_e),i.height=Math.floor(t*_e),n===!0&&(i.style.width=e+`px`,i.style.height=t+`px`),A!==null&&A.setSize(i.width,i.height),this.setViewport(0,0,e,t)},this.getDrawingBufferSize=function(e){return e.set(me*_e,he*_e).floor()},this.setDrawingBufferSize=function(e,t,n){me=e,he=t,_e=n,i.width=Math.floor(e*n),i.height=Math.floor(t*n),this.setViewport(0,0,e,t)},this.setEffects=function(e){if(y===1009){Ie(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){W(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}A.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(Se)},this.setViewport=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),L.viewport(F.copy(Se).multiplyScalar(_e).round())},this.getScissor=function(e){return e.copy(Ce)},this.setScissor=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),L.scissor(ue.copy(Ce).multiplyScalar(_e).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(e){L.setScissorTest(we=e)},this.setOpaqueSort=function(e){ve=e},this.setTransparentSort=function(e){ye=e},this.getClearColor=function(e){return e.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor(...arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=b.has(t)}if(e){let e=N.texture.type,t=x.has(e),n=B.getClearColor(),r=B.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(S[0]=i,S[1]=a,S[2]=o,S[3]=r,I.clearBufferuiv(I.COLOR,0,S)):(w[0]=i,w[1]=a,w[2]=o,w[3]=r,I.clearBufferiv(I.COLOR,0,w))}else r|=I.COLOR_BUFFER_BIT}t&&(r|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&I.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),M=e},this.dispose=function(){i.removeEventListener(`webglcontextlost`,st,!1),i.removeEventListener(`webglcontextrestored`,ct,!1),i.removeEventListener(`webglcontextcreationerror`,lt,!1),B.dispose(),Je.dispose(),Ye.dispose(),R.dispose(),Ve.dispose(),Ge.dispose(),nt.dispose(),rt.dispose(),Ke.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,bt),ot.removeEventListener(`sessionend`,xt),St.stop()};function st(e){e.preventDefault(),Be(`WebGLRenderer: Context Lost.`),te=!0}function ct(){Be(`WebGLRenderer: Context Restored.`),te=!1;let e=ze.autoReset,t=Ze.enabled,n=Ze.autoUpdate,r=Ze.needsUpdate,i=Ze.type;at(),ze.autoReset=e,Ze.enabled=t,Ze.autoUpdate=n,Ze.needsUpdate=r,Ze.type=i}function lt(e){Ie(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ut(e){let t=e.target;t.removeEventListener(`dispose`,ut),dt(t)}function dt(e){ft(e),R.remove(e)}function ft(e){let t=R.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=je);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Mt(e,t,n,r,i);L.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=We.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;nt.setup(i,r,s,n,c);let h,g=et;if(c!==null&&(h=He.get(c),g=tt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(L.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(I.LINES)):g.setMode(I.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),L.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(I.LINES):i.isLineLoop?g.setMode(I.LINE_LOOP):g.setMode(I.LINE_STRIP)}else i.isPoints?g.setMode(I.POINTS):i.isSprite&&g.setMode(I.TRIANGLES);if(i.isBatchedMesh)if(Le.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?He.get(c).bytesPerElement:1,o=R.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(I,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function mt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Ot(e,t,n),e.side=0,e.needsUpdate=!0,Ot(e,t,n),e.side=2):Ot(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),D=Ye.get(n),D.init(t),k.push(D),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(D.pushLight(e),e.castShadow&&D.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(D.pushLight(e),e.castShadow&&D.pushShadow(e))}),D.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t)if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];mt(a,n,e),r.add(a)}else mt(t,n,e),r.add(t)}),D=k.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){R.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Le.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let gt=null;function _t(e){gt&&gt(e)}function bt(){St.stop()}function xt(){St.start()}let St=new Ft;St.setAnimationLoop(_t),typeof self<`u`&&St.setContext(self),this.setAnimationLoop=function(e){gt=e,ot.setAnimationLoop(e),e===null?St.stop():St.start()},ot.addEventListener(`sessionstart`,bt),ot.addEventListener(`sessionend`,xt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Ie(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(te===!0)return;M!==null&&M.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=A!==null&&(N===null||n)&&A.begin(j,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(j,e,t,N),D=Ye.get(e,k.length),D.init(t),D.state.textureUnits=z.getTextureUnits(),k.push(D),Oe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Oe,it,t.reversedDepth),De=this.localClippingEnabled,Ee=Xe.init(this.clippingPlanes,De),E=Je.get(e,ee.length),E.init(),ee.push(E),ot.enabled===!0&&ot.isPresenting===!0){let e=j.xr.getDepthSensingMesh();e!==null&&Ct(e,t,-1/0,j.sortObjects)}Ct(e,t,0,j.sortObjects),E.finish(),j.sortObjects===!0&&E.sort(ve,ye,t.reversedDepth),Me=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Me&&B.addToRenderList(E,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ee===!0&&Xe.beginShadows();let i=D.state.shadowsArray;if(Ze.render(i,e,t),Ee===!0&&Xe.endShadows(),(r&&A.hasRenderPass())===!1){let n=E.opaque,r=E.transmissive;if(D.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Tt(n,r,e,a)}Me&&B.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];wt(E,e,n,n.viewport)}}else r.length>0&&Tt(n,r,e,t),Me&&B.render(e),wt(E,e,t)}N!==null&&se===0&&(z.updateMultisampleRenderTarget(N),z.updateRenderTargetMipmap(N)),r&&A.end(j),e.isScene===!0&&e.onAfterRender(j,e,t),nt.resetDefaultState(),le=-1,P=null,k.pop(),k.length>0?(D=k[k.length-1],z.setTextureUnits(D.state.textureUnits),Ee===!0&&Xe.setGlobalState(j.clippingPlanes,D.state.camera)):D=null,ee.pop(),E=ee.length>0?ee[ee.length-1]:null,M!==null&&M.renderEnd()};function Ct(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)D.pushLightProbeGrid(e);else if(e.isLight)D.pushLight(e),e.castShadow&&D.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||Te.intersectsSprite(e)){r&&Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Oe);let t=Ge.update(e),i=e.material;i.visible&&E.push(e,t,i,n,Ae.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||Te.intersectsObject(e))){let t=Ge.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Ae.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ae.copy(e.boundingSphere.center)),Ae.applyMatrix4(e.matrixWorld).applyMatrix4(Oe)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&E.push(e,t,s,n,Ae.z,o)}}else i.visible&&E.push(e,t,i,n,Ae.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Ct(i[e],t,n,r)}function wt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;D.setupLightsView(n),Ee===!0&&Xe.setGlobalState(j.clippingPlanes,n),r&&L.viewport(F.copy(r)),i.length>0&&Et(i,t,n),a.length>0&&Et(a,t,n),o.length>0&&Et(o,t,n),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function Tt(t,n,r,i){if((r.isScene===!0?r.overrideMaterial:null)!==null)return;if(D.state.transmissionRenderTarget[i.id]===void 0){let t=Le.has(`EXT_color_buffer_half_float`)||Le.has(`EXT_color_buffer_float`);D.state.transmissionRenderTarget[i.id]=new pt(1,1,{generateMipmaps:!0,type:t?p:C,minFilter:e,samples:Math.max(4,Re.samples),stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace})}let a=D.state.transmissionRenderTarget[i.id],o=i.viewport||F;a.setSize(o.z*j.transmissionResolutionScale,o.w*j.transmissionResolutionScale);let s=j.getRenderTarget(),l=j.getActiveCubeFace(),u=j.getActiveMipmapLevel();j.setRenderTarget(a),j.getClearColor(fe),pe=j.getClearAlpha(),pe<1&&j.setClearColor(16777215,.5),j.clear(),Me&&B.render(r);let d=j.toneMapping;j.toneMapping=0;let f=i.viewport;if(i.viewport!==void 0&&(i.viewport=void 0),D.setupLightsView(i),Ee===!0&&Xe.setGlobalState(j.clippingPlanes,i),Et(t,r,i),z.updateMultisampleRenderTarget(a),z.updateRenderTargetMipmap(a),Le.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let t=0,a=n.length;t<a;t++){let{object:a,geometry:o,material:s,group:c}=n[t];if(s.side===2&&a.layers.test(i.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Dt(a,r,i,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(z.updateMultisampleRenderTarget(a),z.updateRenderTargetMipmap(a))}j.setRenderTarget(s,l,u),j.setClearColor(fe,pe),f!==void 0&&(i.viewport=f),j.toneMapping=d}function Et(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Dt(o,t,n,s,l,c)}}function Dt(e,t,n,r,i,a){e.onBeforeRender(j,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(j,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=2):j.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(j,t,n,r,i,a)}function Ot(e,t,n){t.isScene!==!0&&(t=je);let r=R.get(e),i=D.state.lights,a=D.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,D.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ve.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ut),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return At(e,s),d}else s.uniforms=Ke.getUniforms(e),M!==null&&e.isNodeMaterial&&M.build(e,n,s),e.onBeforeCompile(s,j),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),At(e,s),r.needsLights=Pt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=D.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function kt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=kr.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function At(e,t){let n=R.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function jt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];T.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(T))return n}return null}function Mt(e,t,n,r,i){t.isScene!==!0&&(t=je),z.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?j.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Qe.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ve.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=j.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=R.get(r),y=D.state.lights;if(Ee===!0&&(De===!0||e!==P)){let t=e===P&&r.id===le;Xe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=D.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Ot(r,t,i),M&&r.isNodeMaterial&&M.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(L.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==le&&(le=r.id,C=!0),v.needsLights){let e=jt(D.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||P!==e){L.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(I,`projectionMatrix`,e.projectionMatrix),T.setValue(I,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(I,ke.setFromMatrixPosition(e.matrixWorld)),Re.logarithmicDepthBuffer&&T.setValue(I,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(I,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(I,`directionalShadowMap`,y.state.directionalShadowMap,z),y.state.spotShadowMap.length>0&&T.setValue(I,`spotShadowMap`,y.state.spotShadowMap,z),y.state.pointShadowMap.length>0&&T.setValue(I,`pointShadowMap`,y.state.pointShadowMap,z)),i.isSkinnedMesh){T.setOptional(I,i,`bindMatrix`),T.setOptional(I,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(I,`boneTexture`,e.boneTexture,z))}i.isBatchedMesh&&(T.setOptional(I,i,`batchingTexture`),T.setValue(I,`batchingTexture`,i._matricesTexture,z),T.setOptional(I,i,`batchingIdTexture`),T.setValue(I,`batchingIdTexture`,i._indirectTexture,z),T.setOptional(I,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(I,`batchingColorTexture`,i._colorsTexture,z));let O=n.morphAttributes;if((O.position!==void 0||O.normal!==void 0||O.color!==void 0)&&$e.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(I,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Xi()),C){if(T.setValue(I,`toneMappingExposure`,j.toneMappingExposure),v.needsLights&&Nt(E,w),a&&r.fog===!0&&qe.refreshFogUniforms(E,a),qe.refreshMaterialUniforms(E,r,_e,he,D.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}kr.upload(I,kt(v),E,z)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(kr.upload(I,kt(v),E,z),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(I,`center`,i.center),T.setValue(I,`modelViewMatrix`,i.modelViewMatrix),T.setValue(I,`normalMatrix`,i.normalMatrix),T.setValue(I,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function Nt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Pt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return oe},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=R.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),R.get(e.texture).__webglTexture=t,R.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=R.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,oe=t,se=n;let r=null,i=!1,a=!1;if(e){let o=R.get(e);if(o.__useDefaultFramebuffer!==void 0){L.bindFramebuffer(I.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),ue.copy(e.scissor),de=e.scissorTest,L.viewport(F),L.scissor(ue),L.setScissorTest(de),le=-1;return}else if(o.__webglFramebuffer===void 0)z.setupRenderTarget(e);else if(o.__hasExternalTextures)z.rebindTextures(e,R.get(e.texture).__webglTexture,R.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&R.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);z.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=R.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&z.useMultisampledRTT(e)===!1?R.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),ue.copy(e.scissor),de=e.scissorTest}else F.copy(Se).multiplyScalar(_e).floor(),ue.copy(Ce).multiplyScalar(_e).floor(),de=we;if(n!==0&&(r=ne),L.bindFramebuffer(I.FRAMEBUFFER,r)&&L.drawBuffers(e,r),L.viewport(F),L.scissor(ue),L.setScissorTest(de),i){let r=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=R.get(e.textures[t]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,t.__webglTexture,n)}le=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Ie(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){L.bindFramebuffer(I.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s),!Re.textureFormatReadable(c)){Ie(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Re.textureTypeReadable(l)){Ie(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&I.readPixels(t,n,r,i,V.convert(c),V.convert(l),a)}finally{let e=N===null?null:R.get(N).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c)if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){L.bindFramebuffer(I.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s),!Re.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Re.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,d),I.bufferData(I.PIXEL_PACK_BUFFER,a.byteLength,I.STREAM_READ),I.readPixels(t,n,r,i,V.convert(l),V.convert(u),0);let f=N===null?null:R.get(N).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,f);let p=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await xe(I,p,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,d),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,a),I.deleteBuffer(d),I.deleteSync(p),a}else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;z.setTexture2D(e,0),I.copyTexSubImage2D(I.TEXTURE_2D,n,0,0,o,s,i,a),L.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=V.convert(t.format),_=V.convert(t.type),v;t.isData3DTexture?(z.setTexture3D(t,0),v=I.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(z.setTexture2DArray(t,0),v=I.TEXTURE_2D_ARRAY):(z.setTexture2D(t,0),v=I.TEXTURE_2D),L.activeTexture(I.TEXTURE0),L.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,t.flipY),L.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),L.pixelStorei(I.UNPACK_ALIGNMENT,t.unpackAlignment);let y=L.getParameter(I.UNPACK_ROW_LENGTH),b=L.getParameter(I.UNPACK_IMAGE_HEIGHT),x=L.getParameter(I.UNPACK_SKIP_PIXELS),S=L.getParameter(I.UNPACK_SKIP_ROWS),C=L.getParameter(I.UNPACK_SKIP_IMAGES);L.pixelStorei(I.UNPACK_ROW_LENGTH,h.width),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,h.height),L.pixelStorei(I.UNPACK_SKIP_PIXELS,l),L.pixelStorei(I.UNPACK_SKIP_ROWS,u),L.pixelStorei(I.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=R.get(e),r=R.get(t),h=R.get(n.__renderTarget),g=R.get(r.__renderTarget);L.bindFramebuffer(I.READ_FRAMEBUFFER,h.__webglFramebuffer),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(e).__webglTexture,i,d+n),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(t).__webglTexture,a,m+n)),I.blitFramebuffer(l,u,o,s,f,p,o,s,I.DEPTH_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||R.has(e)){let n=R.get(e),r=R.get(t);L.bindFramebuffer(I.READ_FRAMEBUFFER,re),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,ae);for(let e=0;e<c;e++)w?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,n.__webglTexture,i),T?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,r.__webglTexture,a),i===0?T?I.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):I.copyTexSubImage2D(v,a,f,p,l,u,o,s):I.blitFramebuffer(l,u,o,s,f,p,o,s,I.COLOR_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?I.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h);L.pixelStorei(I.UNPACK_ROW_LENGTH,y),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,b),L.pixelStorei(I.UNPACK_SKIP_PIXELS,x),L.pixelStorei(I.UNPACK_SKIP_ROWS,S),L.pixelStorei(I.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&I.generateMipmap(v),L.unbindTexture()},this.initRenderTarget=function(e){R.get(e).__webglFramebuffer===void 0&&z.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?z.setTextureCube(e,0):e.isData3DTexture?z.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?z.setTexture2DArray(e,0):z.setTexture2D(e,0),L.unbindTexture()},this.resetState=function(){oe=0,se=0,N=null,L.reset(),nt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return it}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}},Qi={type:`change`},$i={type:`start`},ea={type:`end`},ta=new kt,na=new P,ra=Math.cos(70*je.DEG2RAD),ia=new U,aa=2*Math.PI,q={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},oa=1e-6,sa=class extends z{constructor(e,t=null){super(e,t),this.state=q.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:at.ROTATE,MIDDLE:at.DOLLY,RIGHT:at.PAN},this.touches={ONE:fe.ROTATE,TWO:fe.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new k,this._lastTargetPosition=new U,this._quat=new k().setFromUnitVectors(e.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Nt,this._sphericalDelta=new Nt,this._scale=1,this._panOffset=new U,this._rotateStart=new V,this._rotateEnd=new V,this._rotateDelta=new V,this._panStart=new V,this._panEnd=new V,this._panDelta=new V,this._dollyStart=new V,this._dollyEnd=new V,this._dollyDelta=new V,this._dollyDirection=new U,this._mouse=new V,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=la.bind(this),this._onPointerDown=ca.bind(this),this._onPointerUp=ua.bind(this),this._onContextMenu=_a.bind(this),this._onMouseWheel=pa.bind(this),this._onKeyDown=ma.bind(this),this._onTouchStart=ha.bind(this),this._onTouchMove=ga.bind(this),this._onMouseDown=da.bind(this),this._onMouseMove=fa.bind(this),this._interceptControlDown=va.bind(this),this._interceptControlUp=ya.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=``}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Qi),this.update(),this.state=q.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;ia.copy(t).sub(this.target),ia.applyQuaternion(this._quat),this._spherical.setFromVector3(ia),this.autoRotate&&this.state===q.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=aa:n>Math.PI&&(n-=aa),r<-Math.PI?r+=aa:r>Math.PI&&(r-=aa),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(ia.setFromSpherical(this._spherical),ia.applyQuaternion(this._quatInverse),t.copy(this.target).add(ia),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=ia.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new U(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new U(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=ia.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(ta.origin.copy(this.object.position),ta.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ta.direction))<ra?this.object.lookAt(this.target):(na.setFromNormalAndCoplanarPoint(this.object.up,this.target),ta.intersectPlane(na,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>oa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>oa||this._lastTargetPosition.distanceToSquared(this.target)>oa?(this.dispatchEvent(Qi),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?aa/60/60*this.autoRotateSpeed:aa/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){ia.setFromMatrixColumn(t,0),ia.multiplyScalar(-e),this._panOffset.add(ia)}_panUp(e,t){this.screenSpacePanning===!0?ia.setFromMatrixColumn(t,1):(ia.setFromMatrixColumn(t,0),ia.crossVectors(this.object.up,ia)),ia.multiplyScalar(e),this._panOffset.add(ia)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;ia.copy(r).sub(this.target);let i=ia.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(aa*this._rotateDelta.x/t.clientHeight),this._rotateUp(aa*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(aa*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-aa*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(aa*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-aa*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(aa*this._rotateDelta.x/t.clientHeight),this._rotateUp(aa*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new V,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function ca(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function la(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function ua(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(ea),this.state=q.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y});break}}function da(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=q.DOLLY;break;case at.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=q.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=q.ROTATE}break;case at.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=q.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=q.PAN}break;default:this.state=q.NONE}this.state!==q.NONE&&this.dispatchEvent($i)}function fa(e){switch(this.state){case q.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case q.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case q.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e);break}}function pa(e){this.enabled===!1||this.enableZoom===!1||this.state!==q.NONE||(e.preventDefault(),this.dispatchEvent($i),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(ea))}function ma(e){this.enabled!==!1&&this._handleKeyDown(e)}function ha(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case fe.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=q.TOUCH_ROTATE;break;case fe.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=q.TOUCH_PAN;break;default:this.state=q.NONE}break;case 2:switch(this.touches.TWO){case fe.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=q.TOUCH_DOLLY_PAN;break;case fe.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=q.TOUCH_DOLLY_ROTATE;break;default:this.state=q.NONE}break;default:this.state=q.NONE}this.state!==q.NONE&&this.dispatchEvent($i)}function ga(e){switch(this._trackPointer(e),this.state){case q.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case q.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case q.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case q.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=q.NONE}}function _a(e){this.enabled!==!1&&e.preventDefault()}function va(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function ya(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}console.log(`[createScene] Module loaded`);function ba(){let e=new ee;e.background=new H(856343);let t=document.getElementById(`threeCanvas`);if(console.log(`[createScene] Canvas:`,t,t?t.clientWidth+`x`+t.clientHeight:`none`),!t)throw Error(`Canvas element #threeCanvas not found`);let n=t.parentElement||t;function i(){return{width:n.clientWidth,height:n.clientHeight}}let a=i(),o=new Zi({canvas:t,antialias:!0,alpha:!0,powerPreference:`high-performance`});console.log(`[createScene] Renderer created`),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.setSize(Math.max(a.width,1),Math.max(a.height,1),!1),o.outputColorSpace=r,o.toneMapping=4,o.toneMappingExposure=1,o.shadowMap.enabled=!1;let s=new Tt(50,Math.max(a.width,1)/Math.max(a.height,1),.01,100);s.position.set(0,0,3);let c=new sa(s,t);c.enableDamping=!0,c.dampingFactor=.05,c.enablePan=!0,c.enableZoom=!0,c.enableRotate=!0,c.autoRotate=!1,c.minDistance=.02,c.maxDistance=20,c.maxPolarAngle=Math.PI*.95,c.minPolarAngle=Math.PI*.05,c.target.set(0,0,0),c.touches={ONE:fe.ROTATE,TWO:fe.DOLLY_PAN};let l=xa(e);function u(){let{width:e,height:t}=i();!e||!t||(s.aspect=e/t,s.updateProjectionMatrix(),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.setSize(e,t,!1),_())}t.addEventListener(`keydown`,e=>{let t=e.shiftKey?.25:.08,n={ArrowLeft:()=>d(-t,0),ArrowRight:()=>d(t,0),ArrowUp:()=>d(0,-t),ArrowDown:()=>d(0,t),"+":()=>f(.9),"=":()=>f(.9),"-":()=>f(1.1)}[e.key];n&&(e.preventDefault(),n(),c.update(),_())});function d(e,t){let n=s.position.clone().sub(c.target),r=new Nt().setFromVector3(n);r.theta-=e,r.phi=je.clamp(r.phi-t,.05,Math.PI-.05),s.position.copy(c.target).add(new U().setFromSpherical(r))}function f(e){let t=s.position.clone().sub(c.target).multiplyScalar(e),n=je.clamp(t.length(),c.minDistance,c.maxDistance);s.position.copy(c.target).add(t.setLength(n))}let p=new ResizeObserver(u);p.observe(n),window.addEventListener(`resize`,u);let m=null,h=!0,g=0;function _(e=1){h=!0,g=Math.max(g,e)}c.addEventListener(`change`,()=>_(30));let v=new Set;function y(e){return v.add(e),()=>v.delete(e)}function b(){m=requestAnimationFrame(b),c.update()&&(g=Math.max(g,2)),!(!h&&g<=0)&&(g>0&&g--,h=!1,o.render(e,s),v.forEach(e=>e()))}function x(){m||(_(),b())}function S(){m&&=(cancelAnimationFrame(m),null)}function C(){_()}function w(){S(),p.disconnect(),window.removeEventListener(`resize`,u),c.dispose(),o.dispose(),e.clear()}return{scene:e,camera:s,renderer:o,controls:c,lights:l,canvas:t,startRenderLoop:x,stopRenderLoop:S,render:C,onFrame:y,dispose:w,onResize:u}}function xa(e){let t={};return t.ambient=new tt(16777215,.6),e.add(t.ambient),t.key=new le(16777215,1),t.key.position.set(50,100,50),e.add(t.key),t.fill=new le(8956671,.4),t.fill.position.set(-50,50,-50),e.add(t.fill),t.rim=new le(16777198,.3),t.rim.position.set(0,-50,-100),e.add(t.rim),t.hemi=new b(8965375,3351057,.3),e.add(t.hemi),t}function Sa(e,t){e.background=new H(t)}function Ca(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}function wa(e){let t=new Map,n=new Map,r=e.clone();return Ta(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function Ta(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)Ta(e.children[r],t.children[r],n)}var Ea=class extends dt{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new Ma(e)}),this.register(function(e){return new Na(e)}),this.register(function(e){return new Ha(e)}),this.register(function(e){return new Ua(e)}),this.register(function(e){return new Wa(e)}),this.register(function(e){return new Fa(e)}),this.register(function(e){return new Ia(e)}),this.register(function(e){return new La(e)}),this.register(function(e){return new Ra(e)}),this.register(function(e){return new ja(e)}),this.register(function(e){return new za(e)}),this.register(function(e){return new Pa(e)}),this.register(function(e){return new Va(e)}),this.register(function(e){return new Ba(e)}),this.register(function(e){return new ka(e)}),this.register(function(e){return new Ga(e,J.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new Ga(e,J.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new Ka(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=We.extractUrlBase(e);a=We.resolveURL(t,this.path)}else a=We.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new Je(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(s.decode(new Uint8Array(e,0,4))===qa){try{a[J.KHR_BINARY_GLTF]=new Xa(e)}catch(e){r&&r(e);return}i=JSON.parse(a[J.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new Co(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case J.KHR_MATERIALS_UNLIT:a[t]=new Aa;break;case J.KHR_DRACO_MESH_COMPRESSION:a[t]=new Za(i,this.dracoLoader);break;case J.KHR_TEXTURE_TRANSFORM:a[t]=new Qa;break;case J.KHR_MESH_QUANTIZATION:a[t]=new $a;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function Da(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function Oa(e,t,n){let r=e.json.materials[t];return r.extensions&&r.extensions[n]?r.extensions[n]:null}var J={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,KHR_MESHOPT_COMPRESSION:`KHR_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},ka=class{constructor(e){this.parser=e,this.name=J.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,o=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],s,c=new H(16777215);o.color!==void 0&&c.setRGB(o.color[0],o.color[1],o.color[2],gt);let l=o.range===void 0?0:o.range;switch(o.type){case`directional`:s=new le(c),s.target.position.set(0,0,-1),s.add(s.target);break;case`point`:s=new M(c),s.distance=l;break;case`spot`:s=new a(c),s.distance=l,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle===void 0?0:o.spot.innerConeAngle,o.spot.outerConeAngle=o.spot.outerConeAngle===void 0?Math.PI/4:o.spot.outerConeAngle,s.angle=o.spot.outerConeAngle,s.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,s.target.position.set(0,0,-1),s.add(s.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+o.type)}return s.position.set(0,0,0),ho(s,o),o.intensity!==void 0&&(s.intensity=o.intensity),s.name=t.createUniqueName(o.name||`light_`+e),r=Promise.resolve(s),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},Aa=class{constructor(){this.name=J.KHR_MATERIALS_UNLIT}getMaterialType(){return Le}extendParams(e,t,n){let i=[];e.color=new H(1,1,1),e.opacity=1;let a=t.pbrMetallicRoughness;if(a){if(Array.isArray(a.baseColorFactor)){let t=a.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],gt),e.opacity=t[3]}a.baseColorTexture!==void 0&&i.push(n.assignTexture(e,`map`,a.baseColorTexture,r))}return Promise.all(i)}},ja=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Ma=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatMap`,n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatRoughnessMap`,n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,`clearcoatNormalMap`,n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let e=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new V(e,e)}return Promise.all(r)}},Na=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion===void 0?0:n.dispersion),Promise.resolve()}},Pa=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceMap`,n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceThicknessMap`,n.iridescenceThicknessTexture)),Promise.all(r)}},Fa=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_SHEEN}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new H(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let e=n.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],gt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,`sheenColorMap`,n.sheenColorTexture,r)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,`sheenRoughnessMap`,n.sheenRoughnessTexture)),Promise.all(i)}},Ia=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,`transmissionMap`,n.transmissionTexture)),Promise.all(r)}},La=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_VOLUME}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor===void 0?0:n.thicknessFactor,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`thicknessMap`,n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let i=n.attenuationColor||[1,1,1];return t.attenuationColor=new H().setRGB(i[0],i[1],i[2],gt),Promise.all(r)}},Ra=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_IOR}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);return n===null?Promise.resolve():(t.ior=n.ior===void 0?1.5:n.ior,t.ior===0&&(t.ior=1e3),Promise.resolve())}},za=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor===void 0?1:n.specularFactor,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,`specularIntensityMap`,n.specularTexture));let a=n.specularColorFactor||[1,1,1];return t.specularColor=new H().setRGB(a[0],a[1],a[2],gt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,`specularColorMap`,n.specularColorTexture,r)),Promise.all(i)}},Ba=class{constructor(e){this.parser=e,this.name=J.EXT_MATERIALS_BUMP}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor===void 0?1:n.bumpFactor,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,`bumpMap`,n.bumpTexture)),Promise.all(r)}},Va=class{constructor(e){this.parser=e,this.name=J.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Oa(this.parser,e,this.name)===null?null:Ve}extendMaterialParams(e,t){let n=Oa(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,`anisotropyMap`,n.anisotropyTexture)),Promise.all(r)}},Ha=class{constructor(e){this.parser=e,this.name=J.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},Ua=class{constructor(e){this.parser=e,this.name=J.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Wa=class{constructor(e){this.parser=e,this.name=J.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Ga=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}else return null}},Ka=class{constructor(e){this.name=J.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==ro.TRIANGLES&&e.mode!==ro.TRIANGLE_STRIP&&e.mode!==ro.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new yt,n=new U,a=new k,s=new U(1,1,1),c=new Mt(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));for(let t in o)if(t===`_COLOR_0`){let e=o[t];c.instanceColor=new ae(e.array,e.itemSize,e.normalized)}else t!==`TRANSLATION`&&t!==`ROTATION`&&t!==`SCALE`&&e.geometry.setAttribute(t,o[t]);N.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},qa=`glTF`,Ja=12,Ya={JSON:1313821514,BIN:5130562},Xa=class{constructor(e){this.name=J.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ja),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==qa)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-Ja,i=new DataView(e,Ja),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Ya.JSON){let r=new Uint8Array(e,Ja+a,t);this.content=n.decode(r)}else if(r===Ya.BIN){let n=Ja+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},Za=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=J.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=co[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=co[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=io[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,gt,n)})})}},Qa=class{constructor(){this.name=J.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0?e:(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0,e)}},$a=class{constructor(){this.name=J.KHR_MESH_QUANTIZATION}},eo=class extends F{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},to=new k,no=class extends eo{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return to.fromArray(i).normalize().toArray(i),i}},ro={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},io={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ao={9728:St,9729:re,9984:Oe,9985:I,9986:jt,9987:e},oo={33071:Fe,33648:Se,10497:c},so={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},co={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},lo={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},uo={CUBICSPLINE:void 0,LINEAR:g,STEP:pe},fo={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function po(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new R({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function mo(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function ho(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function go(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function _o(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function vo(e){let t,n=e.extensions&&e.extensions[J.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+yo(n.attributes):e.indices+`:`+yo(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+yo(e.targets[n]);return t}function yo(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function bo(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function xo(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var So=new yt,Co=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Da,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`&&navigator.userAgent!==void 0){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>`u`||n&&r<17||i&&a<98?this.textureLoader=new ue(this.options.manager):this.textureLoader=new E(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Je(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return mo(i,a,r),ho(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[J.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(We.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=so[r.type],t=io[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new Xe(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=so[r.type],o=io[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new de(f,u/s),t.cache.add(n,c)),p=new v(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new Xe(f,a,d);if(r.sparse!==void 0){let t=so.SCALAR,n=io[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new Xe(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=ao[n.magFilter]||1006,t.minFilter=ao[n.minFilter]||1008,t.wrapS=oo[n.wrapS]||1e3,t.wrapT=oo[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new y(e);t.needsUpdate=!0,n(t)}),t.load(We.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),ho(e,a),e.userData.mimeType=a.mimeType||xo(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[J.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[J.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[J.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,a=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new i,mt.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new _e,mt.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||a||o){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),a&&(e+=`vertex-colors:`),o&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),a&&(t.vertexColors=!0),o&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return R}loadMaterial(e){let t=this,n=this.json,i=this.extensions,a=n.materials[e],o,s={},c=a.extensions||{},l=[];if(c[J.KHR_MATERIALS_UNLIT]){let e=i[J.KHR_MATERIALS_UNLIT];o=e.getMaterialType(),l.push(e.extendParams(s,a,t))}else{let n=a.pbrMetallicRoughness||{};if(s.color=new H(1,1,1),s.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;s.color.setRGB(e[0],e[1],e[2],gt),s.opacity=e[3]}n.baseColorTexture!==void 0&&l.push(t.assignTexture(s,`map`,n.baseColorTexture,r)),s.metalness=n.metallicFactor===void 0?1:n.metallicFactor,s.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(s,`metalnessMap`,n.metallicRoughnessTexture)),l.push(t.assignTexture(s,`roughnessMap`,n.metallicRoughnessTexture))),o=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,s)})))}a.doubleSided===!0&&(s.side=2);let u=a.alphaMode||fo.OPAQUE;if(u===fo.BLEND?(s.transparent=!0,s.depthWrite=!1):(s.transparent=!1,u===fo.MASK&&(s.alphaTest=a.alphaCutoff===void 0?.5:a.alphaCutoff)),a.normalTexture!==void 0&&o!==Le&&(l.push(t.assignTexture(s,`normalMap`,a.normalTexture)),s.normalScale=new V(1,1),a.normalTexture.scale!==void 0)){let e=a.normalTexture.scale;s.normalScale.set(e,e)}if(a.occlusionTexture!==void 0&&o!==Le&&(l.push(t.assignTexture(s,`aoMap`,a.occlusionTexture)),a.occlusionTexture.strength!==void 0&&(s.aoMapIntensity=a.occlusionTexture.strength)),a.emissiveFactor!==void 0&&o!==Le){let e=a.emissiveFactor;s.emissive=new H().setRGB(e[0],e[1],e[2],gt)}return a.emissiveTexture!==void 0&&o!==Le&&l.push(t.assignTexture(s,`emissiveMap`,a.emissiveTexture,r)),Promise.all(l).then(function(){let n=new o(s);return a.name&&(n.name=a.name),ho(n,a),t.associations.set(n,{materials:e}),a.extensions&&mo(i,n,a),n})}createUniqueName(e){let t=qe.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[J.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return To(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=vo(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[J.KHR_DRACO_MESH_COMPRESSION]?i(o):To(new _t,o,t),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?po(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===ro.TRIANGLES||u.mode===ro.TRIANGLE_STRIP||u.mode===ro.TRIANGLE_FAN||u.mode===void 0)d=i.isSkinnedMesh===!0?new x(l,f):new Ne(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),u.mode===ro.TRIANGLE_STRIP?d.geometry=Ca(d.geometry,1):u.mode===ro.TRIANGLE_FAN&&(d.geometry=Ca(d.geometry,2));else if(u.mode===ro.LINES)d=new ve(l,f);else if(u.mode===ro.LINE_STRIP)d=new ct(l,f);else if(u.mode===ro.LINE_LOOP)d=new he(l,f);else if(u.mode===ro.POINTS)d=new Ye(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&_o(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),ho(d,i),u.extensions&&mo(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&mo(r,c[0],i),c[0];let l=new ne;i.extensions&&mo(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn(`THREE.GLTFLoader: Missing camera parameters.`);return}return n.type===`perspective`?t=new Tt(je.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new l(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ho(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new yt;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new m(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new ut(i,void 0,l);return ho(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,So)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);if(t.userData.pivot!==void 0&&n.length>0){let e=t.userData.pivot,r=n[0];t.pivot=new U().fromArray(e),t.position.x-=e[0],t.position.y-=e[1],t.position.z-=e[2],r.position.set(0,0,0),delete t.userData.pivot}return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new rt:t.length>1?new ne:t.length===1?t[0]:new N,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),ho(o,i),i.extensions&&mo(n,o,i),i.matrix!==void 0){let e=new yt;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new ne;n.name&&(i.name=r.createUniqueName(n.name)),ho(i,n),n.extensions&&mo(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++){let n=e[t];n.parent===null?i.add(n):i.add(wa(n))}return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof mt||e instanceof y)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];function c(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}lo[i.path]===lo.weights?(c(e),e.isGroup&&e.children.forEach(c)):s.push(o);let l;switch(lo[i.path]){case lo.weights:l=Dt;break;case lo.rotation:l=j;break;case lo.translation:case lo.scale:l=we;break;default:switch(n.itemSize){case 1:l=Dt;break;default:l=we;break}break}let u=r.interpolation===void 0?g:uo[r.interpolation],d=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new l(s[e]+`.`+lo[i.path],t.array,d,u);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=bo(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof j?no:eo)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function wo(e,t,n){let r=t.attributes,i=new ft;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new U(t[0],t[1],t[2]),new U(a[0],a[1],a[2])),e.normalized){let t=bo(io[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new U,t=new U;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=bo(io[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new D;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function To(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=co[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return Qe.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qe.workingColorSpace}" not supported.`),ho(e,t),wo(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:go(e,t.targets,n)})}var Eo=new WeakMap,Do=new URL(`/3d/assets/draco_decoder-C32yEggz.wasm`,``+import.meta.url).toString(),Oo=new URL(`/3d/assets/draco_wasm_wrapper-DxJM36Ib.js`,``+import.meta.url).toString(),ko=new URL(`/3d/assets/draco_decoder-fzg4nYZr.js`,``+import.meta.url).toString();new URL(`/3d/assets/draco_wasm_wrapper-fZCQGLGb.js`,``+import.meta.url).toString(),new URL(`/3d/assets/draco_decoder-Z1_iN-Ht.wasm`,``+import.meta.url).toString();var Ao=class extends dt{constructor(e){super(e),this.decoderPaths={js:Oo,wasm:Do,dep_js:ko},this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL=``,this.defaultAttributeIDs={position:`POSITION`,normal:`NORMAL`,color:`COLOR`,uv:`TEX_COORD`},this.defaultAttributeTypes={position:`Float32Array`,normal:`Float32Array`,color:`Float32Array`,uv:`Float32Array`}}setDecoderPath(e){let{decoderPaths:t}=this;return typeof e==`object`?(t.js=e.js,t.wasm=e.wasm,t.dep_js=null):(t.js=We.resolveURL(`draco_wasm_wrapper.js`,e),t.wasm=We.resolveURL(`draco_decoder.wasm`,e),t.dep_js=We.resolveURL(`draco_decoder.js`,e)),this}setDecoderConfig(e){return console.warn(`THREE.DRACOLoader: setDecoderConfig to has been deprecated and will be removed in r194.`),this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,t,n,r){let i=new Je(this.manager);i.setPath(this.path),i.setResponseType(`arraybuffer`),i.setRequestHeader(this.requestHeader),i.setWithCredentials(this.withCredentials),i.load(e,e=>{this.parse(e,t,r)},n,r)}parse(e,t,n=()=>{}){this.decodeDracoFile(e,t,null,null,r,n).catch(n)}decodeDracoFile(e,t,n,r,i=gt,a=()=>{}){let o={attributeIDs:n||this.defaultAttributeIDs,attributeTypes:r||this.defaultAttributeTypes,useUniqueIDs:!!n,vertexColorSpace:i};return this.decodeGeometry(e,o).then(t).catch(a)}decodeGeometry(e,t){let n=JSON.stringify(t);if(Eo.has(e)){let t=Eo.get(e);if(t.key===n)return t.promise;if(e.byteLength===0)throw Error(`THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.`)}let r,i=this.workerNextTaskID++,a=e.byteLength,o=this._getWorker(i,a).then(n=>(r=n,new Promise((n,a)=>{r._callbacks[i]={resolve:n,reject:a},r.postMessage({type:`decode`,id:i,taskConfig:t,buffer:e},[e])}))).then(e=>this._createGeometry(e.geometry));return o.catch(()=>!0).then(()=>{r&&i&&this._releaseTask(r,i)}),Eo.set(e,{key:n,promise:o}),o}_createGeometry(e){let t=new _t;e.index&&t.setIndex(new Xe(e.index.array,1));for(let n=0;n<e.attributes.length;n++){let{name:r,array:i,itemSize:a,stride:o,vertexColorSpace:s}=e.attributes[n],c;c=a===o?new Xe(i,a):new v(new de(i,o),a,0),r===`color`&&(this._assignVertexColorSpace(c,s),c.normalized=!(i instanceof Float32Array)),t.setAttribute(r,c)}return t}_assignVertexColorSpace(e,t){if(t!==`srgb`)return;let n=new H;for(let t=0,i=e.count;t<i;t++)n.fromBufferAttribute(e,t),Qe.colorSpaceToWorking(n,r),e.setXYZ(t,n.r,n.g,n.b)}_loadLibrary(e,t){let n=new Je(this.manager);return n.setResponseType(t),n.setWithCredentials(this.withCredentials),new Promise((t,r)=>{n.load(e,t,void 0,r)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;let e=typeof WebAssembly!=`object`||this.decoderConfig.type===`js`,t=[],{decoderPaths:n}=this;if(e){if(n.dep_js===null)throw Error(`THREE.DRACOLoader: WebAssembly is required when using a custom decoder paths.`);t.push(this._loadLibrary(n.dep_js,`text`))}else t.push(this._loadLibrary(n.js,`text`)),t.push(this._loadLibrary(n.wasm,`arraybuffer`));return this.decoderPending=Promise.all(t).then(t=>{let n=t[0];e||(this.decoderConfig.wasmBinary=t[1]);let r=jo.toString(),i=[`/* draco decoder */`,n,``,`/* worker */`,r.substring(r.indexOf(`{`)+1,r.lastIndexOf(`}`))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([i]))}),this.decoderPending}_getWorker(e,t){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){let e=new Worker(this.workerSourceURL);e._callbacks={},e._taskCosts={},e._taskLoad=0,e.postMessage({type:`init`,decoderConfig:this.decoderConfig}),e.onmessage=function(t){let n=t.data;switch(n.type){case`decode`:e._callbacks[n.id].resolve(n);break;case`error`:e._callbacks[n.id].reject(n);break;default:console.error(`THREE.DRACOLoader: Unexpected message, "`+n.type+`"`)}},this.workerPool.push(e)}else this.workerPool.sort(function(e,t){return e._taskLoad>t._taskLoad?-1:1});let n=this.workerPool[this.workerPool.length-1];return n._taskCosts[e]=t,n._taskLoad+=t,n})}_releaseTask(e,t){e._taskLoad-=e._taskCosts[t],delete e._callbacks[t],delete e._taskCosts[t]}debug(){console.log(`Task load: `,this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==``&&URL.revokeObjectURL(this.workerSourceURL),this}};function jo(){let e,t;onmessage=function(r){let i=r.data;switch(i.type){case`init`:e=i.decoderConfig,t=new Promise(function(t){e.onModuleLoaded=function(e){t({draco:e})},DracoDecoderModule(e)});break;case`decode`:let r=i.buffer,a=i.taskConfig;t.then(e=>{let t=e.draco,o=new t.Decoder;try{let e=n(t,o,new Int8Array(r),a),s=e.attributes.map(e=>e.array.buffer);e.index&&s.push(e.index.array.buffer),self.postMessage({type:`decode`,id:i.id,geometry:e},s)}catch(e){console.error(e),self.postMessage({type:`error`,id:i.id,error:e.message})}finally{t.destroy(o)}});break}};function n(e,t,n,a){let o=a.attributeIDs,s=a.attributeTypes,c,l,u=t.GetEncodedGeometryType(n);if(u===e.TRIANGULAR_MESH)c=new e.Mesh,l=t.DecodeArrayToMesh(n,n.byteLength,c);else if(u===e.POINT_CLOUD)c=new e.PointCloud,l=t.DecodeArrayToPointCloud(n,n.byteLength,c);else throw Error(`THREE.DRACOLoader: Unexpected geometry type.`);if(!l.ok()||c.ptr===0)throw Error(`THREE.DRACOLoader: Decoding failed: `+l.error_msg());let d={index:null,attributes:[]};for(let n in o){let r=self[s[n]],l,u;if(a.useUniqueIDs)u=o[n],l=t.GetAttributeByUniqueId(c,u);else{if(u=t.GetAttributeId(c,e[o[n]]),u===-1)continue;l=t.GetAttribute(c,u)}let f=i(e,t,c,n,r,l);n===`color`&&(f.vertexColorSpace=a.vertexColorSpace),d.attributes.push(f)}return u===e.TRIANGULAR_MESH&&(d.index=r(e,t,c)),e.destroy(c),d}function r(e,t,n){let r=n.num_faces()*3,i=r*4,a=e._malloc(i);t.GetTrianglesUInt32Array(n,i,a);let o=new Uint32Array(e.HEAPF32.buffer,a,r).slice();return e._free(a),{array:o,itemSize:1}}function i(e,t,n,r,i,o){let s=n.num_points(),c=o.num_components(),l=a(e,i),u=c*i.BYTES_PER_ELEMENT,d=Math.ceil(u/4)*4,f=d/i.BYTES_PER_ELEMENT,p=s*u,m=s*d,h=e._malloc(p);t.GetAttributeDataArrayForAllPoints(n,o,l,p,h);let g=new i(e.HEAPF32.buffer,h,p/i.BYTES_PER_ELEMENT),_;if(u===d)_=g.slice();else{_=new i(m/i.BYTES_PER_ELEMENT);let e=0;for(let t=0,n=g.length;t<n;t++){for(let n=0;n<c;n++)_[e+n]=g[t*c+n];e+=f}}return e._free(h),{name:r,count:s,itemSize:c,array:_,stride:f}}function a(e,t){switch(t){case Float32Array:return e.DT_FLOAT32;case Int8Array:return e.DT_INT8;case Int16Array:return e.DT_INT16;case Int32Array:return e.DT_INT32;case Uint8Array:return e.DT_UINT8;case Uint16Array:return e.DT_UINT16;case Uint32Array:return e.DT_UINT32}}}var Mo=1.25,No=65535;No<<16;var Po=2**-24,Fo=Symbol(`SKIP_GENERATION`),Io={strategy:0,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[Fo]:!1};function Lo(e,t,n){return n.min.x=t[e],n.min.y=t[e+1],n.min.z=t[e+2],n.max.x=t[e+3],n.max.y=t[e+4],n.max.z=t[e+5],n}function Ro(e){let t=-1,n=-1/0;for(let r=0;r<3;r++){let i=e[r+3]-e[r];i>n&&(n=i,t=r)}return t}function zo(e,t){t.set(e)}function Bo(e,t,n){let r,i;for(let a=0;a<3;a++){let o=a+3;r=e[a],i=t[a],n[a]=r<i?r:i,r=e[o],i=t[o],n[o]=r>i?r:i}}function Vo(e,t,n){for(let r=0;r<3;r++){let i=t[e+2*r],a=t[e+2*r+1],o=i-a,s=i+a;o<n[r]&&(n[r]=o),s>n[r+3]&&(n[r+3]=s)}}function Ho(e){let t=e[3]-e[0],n=e[4]-e[1],r=e[5]-e[2];return 2*(t*n+n*r+r*t)}function Uo(e,t){return t[e+15]===No}function Wo(e,t){return t[e+6]}function Go(e,t){return t[e+14]}function Ko(e){return e+8}function qo(e,t){return e+t[e+6]*8}function Jo(e,t){return t[e+7]}function Yo(e){return e}function Xo(e,t,n,r,i){let a=1/0,o=1/0,s=1/0,c=-1/0,l=-1/0,u=-1/0,d=1/0,f=1/0,p=1/0,m=-1/0,h=-1/0,g=-1/0,_=e.offset||0;for(let r=(t-_)*6,i=(t+n-_)*6;r<i;r+=6){let t=e[r+0],n=e[r+1],i=t-n,_=t+n;i<a&&(a=i),_>c&&(c=_),t<d&&(d=t),t>m&&(m=t);let v=e[r+2],y=e[r+3],b=v-y,x=v+y;b<o&&(o=b),x>l&&(l=x),v<f&&(f=v),v>h&&(h=v);let S=e[r+4],C=e[r+5],w=S-C,T=S+C;w<s&&(s=w),T>u&&(u=T),S<p&&(p=S),S>g&&(g=S)}r[0]=a,r[1]=o,r[2]=s,r[3]=c,r[4]=l,r[5]=u,i[0]=d,i[1]=f,i[2]=p,i[3]=m,i[4]=h,i[5]=g}var Zo=32,Qo=(e,t)=>e.candidate-t.candidate,$o=Array(Zo).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),es=new Float32Array(6);function ts(e,t,n,r,i,a){let o=-1,s=0;if(a===0)o=Ro(t),o!==-1&&(s=(t[o]+t[o+3])/2);else if(a===1)o=Ro(e),o!==-1&&(s=ns(n,r,i,o));else if(a===2){let a=Ho(e),c=Mo*i,l=n.offset||0,u=(r-l)*6,d=(r+i-l)*6;for(let e=0;e<3;e++){let r=t[e],l=(t[e+3]-r)/Zo;if(i<Zo/4){let t=[...$o];t.length=i;let r=0;for(let i=u;i<d;i+=6,r++){let a=t[r];a.candidate=n[i+2*e],a.count=0;let{bounds:o,leftCacheBounds:s,rightCacheBounds:c}=a;for(let e=0;e<3;e++)c[e]=1/0,c[e+3]=-1/0,s[e]=1/0,s[e+3]=-1/0,o[e]=1/0,o[e+3]=-1/0;Vo(i,n,o)}t.sort(Qo);let l=i;for(let e=0;e<l;e++){let n=t[e];for(;e+1<l&&t[e+1].candidate===n.candidate;)t.splice(e+1,1),l--}for(let r=u;r<d;r+=6){let i=n[r+2*e];for(let e=0;e<l;e++){let a=t[e];i>=a.candidate?Vo(r,n,a.rightCacheBounds):(Vo(r,n,a.leftCacheBounds),a.count++)}}for(let n=0;n<l;n++){let r=t[n],l=r.count,u=i-r.count,d=r.leftCacheBounds,f=r.rightCacheBounds,p=0;l!==0&&(p=Ho(d)/a);let m=0;u!==0&&(m=Ho(f)/a);let h=1+Mo*(p*l+m*u);h<c&&(o=e,c=h,s=r.candidate)}}else{for(let e=0;e<Zo;e++){let t=$o[e];t.count=0,t.candidate=r+l+e*l;let n=t.bounds;for(let e=0;e<3;e++)n[e]=1/0,n[e+3]=-1/0}for(let t=u;t<d;t+=6){let i=~~((n[t+2*e]-r)/l);i>=Zo&&(i=Zo-1);let a=$o[i];a.count++,Vo(t,n,a.bounds)}let t=$o[Zo-1];zo(t.bounds,t.rightCacheBounds);for(let e=Zo-2;e>=0;e--){let t=$o[e],n=$o[e+1];Bo(t.bounds,n.rightCacheBounds,t.rightCacheBounds)}let f=0;for(let t=0;t<Zo-1;t++){let n=$o[t],r=n.count,l=n.bounds,u=$o[t+1].rightCacheBounds;r!==0&&(f===0?zo(l,es):Bo(l,es,es)),f+=r;let d=0,p=0;f!==0&&(d=Ho(es)/a);let m=i-f;m!==0&&(p=Ho(u)/a);let h=1+Mo*(d*f+p*m);h<c&&(o=e,c=h,s=n.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${a} used.`);return{axis:o,pos:s}}function ns(e,t,n,r){let i=0,a=e.offset;for(let o=t,s=t+n;o<s;o++)i+=e[(o-a)*6+r*2];return i/n}var rs=class{constructor(){this.boundingData=new Float32Array(6)}};function is(e,t,n,r,i,a){let o=r,s=r+i-1,c=a.pos,l=a.axis*2,u=n.offset||0;for(;;){for(;o<=s&&n[(o-u)*6+l]<c;)o++;for(;o<=s&&n[(s-u)*6+l]>=c;)s--;if(o<s){for(let n=0;n<t;n++){let r=e[o*t+n];e[o*t+n]=e[s*t+n],e[s*t+n]=r}for(let e=0;e<6;e++){let t=o-u,r=s-u,i=n[t*6+e];n[t*6+e]=n[r*6+e],n[r*6+e]=i}o++,s--}else return o}}var as,os,ss,cs,ls=2**32;function us(e){return`count`in e?1:1+us(e.left)+us(e.right)}function ds(e,t,n){return as=new Float32Array(n),os=new Uint32Array(n),ss=new Uint16Array(n),cs=new Uint8Array(n),fs(e,t)}function fs(e,t){let n=e/4,r=e/2,i=`count`in t,a=t.boundingData;for(let e=0;e<6;e++)as[n+e]=a[e];if(i)return t.buffer?(cs.set(new Uint8Array(t.buffer),e),e+t.buffer.byteLength):(os[n+6]=t.offset,ss[r+14]=t.count,ss[r+15]=No,e+32);{let{left:r,right:i,splitAxis:a}=t,o=fs(e+32,r),s=e/32,c=o/32-s;if(c>ls)throw Error(`MeshBVH: Cannot store relative child node offset greater than 32 bits.`);return os[n+6]=c,os[n+7]=a,fs(o,i)}}function ps(e,t,n,r,i,a){let{maxDepth:o,verbose:s,targetLeafSize:c,_strictLeafSize:l=1/0,strategy:u,onProgress:d}=i,f=e.primitiveBuffer,p=e.primitiveBufferStride,m=new Float32Array(6),h=!1,g=new rs;return Xo(t,n,r,g.boundingData,m),v(g,n,r,m),g;function _(e){d&&d((e-a.offset)/a.count)}function v(e,n,r,i=null,a=0){!h&&a>=o&&(h=!0,s&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));let d=r>l;if(r<=c&&!d||a>=o)return _(n+r),e.offset=n,e.count=r,e;let g=ts(e.boundingData,i,t,n,r,u),y=g.axis===-1?-1:is(f,p,t,n,r,g);if(g.axis===-1||y===n||y===n+r){if(!d)return _(n+r),e.offset=n,e.count=r,e;g.axis=Math.max(0,Ro(e.boundingData)),y=n+Math.max(1,Math.floor(r/2))}e.splitAxis=g.axis;let b=new rs,x=n,S=y-n;e.left=b,Xo(t,x,S,b.boundingData,m),v(b,x,S,m,a+1);let C=new rs,w=y,T=r-S;return e.right=C,Xo(t,w,T,C.boundingData,m),v(C,w,T,m,a+1),e}}function ms(e,t){let n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,r=e.getRootRanges(t.range),i=r[0],a=r[r.length-1],o={offset:i.offset,count:a.offset+a.count-i.offset},s=new Float32Array(6*o.count);s.offset=o.offset,e.computePrimitiveBounds(o.offset,o.count,s),e._roots=r.map(r=>{let i=ps(e,s,r.offset,r.count,t,o),a=us(i),c=new n(32*a);return ds(0,i,c),c})}var hs=class{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){let e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}},gs=new class{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let e=[],t=null;this.setBuffer=n=>{t&&e.push(t),t=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}},_s,vs,ys=[],bs=new hs(()=>new ft);function xs(e,t,n,r,i,a){_s=bs.getPrimitive(),vs=bs.getPrimitive(),ys.push(_s,vs),gs.setBuffer(e._roots[t]);let o=Ss(0,e.geometry,n,r,i,a);gs.clearBuffer(),bs.releasePrimitive(_s),bs.releasePrimitive(vs),ys.pop(),ys.pop();let s=ys.length;return s>0&&(vs=ys[s-1],_s=ys[s-2]),o}function Ss(e,t,n,r,i=null,a=0,o=0){let{float32Array:s,uint16Array:c,uint32Array:l}=gs,u=e*2;if(Uo(u,c)){let t=Wo(e,l),n=Go(u,c);return Lo(Yo(e),s,_s),r(t,n,!1,o,a+e/8,_s)}else{let u=Ko(e),d=qo(e,l),f=u,p=d,m,h,g,_;if(i&&(g=_s,_=vs,Lo(Yo(f),s,g),Lo(Yo(p),s,_),m=i(g),h=i(_),h<m)){f=d,p=u;let e=m;m=h,h=e,g=_}g||(g=_s,Lo(Yo(f),s,g));let v=Uo(f*2,c),y=n(g,v,m,o+1,a+f/8),b;if(y===2){let e=w(f);b=r(e,T(f)-e,!0,o+1,a+f/8,g)}else b=y&&Ss(f,t,n,r,i,a,o+1);if(b)return!0;_=vs,Lo(Yo(p),s,_);let x=Uo(p*2,c),S=n(_,x,h,o+1,a+p/8),C;if(S===2){let e=w(p);C=r(e,T(p)-e,!0,o+1,a+p/8,_)}else C=S&&Ss(p,t,n,r,i,a,o+1);if(C)return!0;return!1;function w(e){let{uint16Array:t,uint32Array:n}=gs,r=e*2;for(;!Uo(r,t);)e=Ko(e),r=e*2;return Wo(e,n)}function T(e){let{uint16Array:t,uint32Array:n}=gs,r=e*2;for(;!Uo(r,t);)e=qo(e,n),r=e*2;return Wo(e,n)+Go(r,t)}}}var Cs=new gs.constructor,ws=new gs.constructor,Ts=new hs(()=>new ft),Es=new ft,Ds=new ft,Os=new ft,ks=new ft,As=!1;function js(e,t,n,r){if(As)throw Error(`MeshBVH: Recursive calls to bvhcast not supported.`);As=!0;let i=e._roots,a=t._roots,o,s=0,c=0,l=new yt().copy(n).invert();for(let e=0,t=i.length;e<t;e++){Cs.setBuffer(i[e]),c=0;let t=Ts.getPrimitive();Lo(Yo(0),Cs.float32Array,t),t.applyMatrix4(l);for(let e=0,i=a.length;e<i&&(ws.setBuffer(a[e]),o=Ms(0,0,n,l,r,s,c,0,0,t),ws.clearBuffer(),c+=a[e].byteLength/32,!o);e++);if(Ts.releasePrimitive(t),Cs.clearBuffer(),s+=i[e].byteLength/32,o)break}return As=!1,o}function Ms(e,t,n,r,i,a=0,o=0,s=0,c=0,l=null,u=!1){let d,f;u?(d=ws,f=Cs):(d=Cs,f=ws);let p=d.float32Array,m=d.uint32Array,h=d.uint16Array,g=f.float32Array,_=f.uint32Array,v=f.uint16Array,y=e*2,b=t*2,x=Uo(y,h),S=Uo(b,v),C=!1;if(S&&x)C=u?i(Wo(t,_),Go(t*2,v),Wo(e,m),Go(e*2,h),c,o+t/8,s,a+e/8):i(Wo(e,m),Go(e*2,h),Wo(t,_),Go(t*2,v),s,a+e/8,c,o+t/8);else if(S){let l=Ts.getPrimitive();Lo(Yo(t),g,l),l.applyMatrix4(n);let d=Ko(e),f=qo(e,m);Lo(Yo(d),p,Es),Lo(Yo(f),p,Ds);let h=l.intersectsBox(Es),_=l.intersectsBox(Ds);C=h&&Ms(t,d,r,n,i,o,a,c,s+1,l,!u)||_&&Ms(t,f,r,n,i,o,a,c,s+1,l,!u),Ts.releasePrimitive(l)}else{let d=Ko(t),f=qo(t,_);Lo(Yo(d),g,Os),Lo(Yo(f),g,ks);let h=l.intersectsBox(Os),v=l.intersectsBox(ks);if(h&&v)C=Ms(e,d,n,r,i,a,o,s,c+1,l,u)||Ms(e,f,n,r,i,a,o,s,c+1,l,u);else if(h)if(x)C=Ms(e,d,n,r,i,a,o,s,c+1,l,u);else{let t=Ts.getPrimitive();t.copy(Os).applyMatrix4(n);let l=Ko(e),f=qo(e,m);Lo(Yo(l),p,Es),Lo(Yo(f),p,Ds);let h=t.intersectsBox(Es),g=t.intersectsBox(Ds);C=h&&Ms(d,l,r,n,i,o,a,c,s+1,t,!u)||g&&Ms(d,f,r,n,i,o,a,c,s+1,t,!u),Ts.releasePrimitive(t)}else if(v)if(x)C=Ms(e,f,n,r,i,a,o,s,c+1,l,u);else{let t=Ts.getPrimitive();t.copy(ks).applyMatrix4(n);let l=Ko(e),d=qo(e,m);Lo(Yo(l),p,Es),Lo(Yo(d),p,Ds);let h=t.intersectsBox(Es),g=t.intersectsBox(Ds);C=h&&Ms(f,l,r,n,i,o,a,c,s+1,t,!u)||g&&Ms(f,d,r,n,i,o,a,c,s+1,t,!u),Ts.releasePrimitive(t)}}return C}var Ns=new class{constructor(){let e=null,t=null,n=null,r=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(i,a)=>{if(r)throw Error(`BVHTraversalHelper: cannot call setBVH during an active traversal.`);this.root=a,this.buffer=e=i._roots[a],this.uint16Array=n=new Uint16Array(e),this.uint32Array=t=new Uint32Array(e)},this.reset=()=>{this.root=null,this.buffer=e=null,this.uint16Array=n=null,this.uint32Array=t=null},this.getRangeStart=e=>{let r=e*2;for(;!Uo(r,n);)e=Ko(e),r=e*2;return Wo(e,t)},this.getRangeEnd=e=>{let r=e*2;for(;!Uo(r,n);)e=qo(e,t),r=e*2;return Wo(e,t)+Go(r,n)};let i=(e,r,a)=>{let o=Uo(r*2,n);if(!e(a,o,r)&&!o){let n=Ko(r),o=qo(r,t);i(e,n,a+1),i(e,o,a+1)}};this.traverseBuffer=e=>{if(r)throw Error(`BVHTraversalHelper: cannot start a traversal during an active traversal.`);r=!0;try{i(e,0,0)}finally{r=!1}},this.traverse=r=>{this.traverseBuffer((i,a,o)=>{if(a){let s=o*2,c=t[o+6],l=n[s+14];return r(i,a,new Float32Array(e,o*4,6),c,l)}else{let n=Jo(o,t);return r(i,a,new Float32Array(e,o*4,6),n)}})}}},Ps=new ft,Fs=new Float32Array(6),Is=class{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(e){e={...Io,...e},`maxLeafSize`in e&&(console.warn(`BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.`),e={...e,targetLeafSize:e.maxLeafSize}),ms(this,e)}getRootRanges(){throw Error(`BVH: getRootRanges() not implemented`)}writePrimitiveBounds(){throw Error(`BVH: writePrimitiveBounds() not implemented`)}writePrimitiveRangeBounds(e,t,n,r){let i=1/0,a=1/0,o=1/0,s=-1/0,c=-1/0,l=-1/0;for(let n=e,r=e+t;n<r;n++){this.writePrimitiveBounds(n,Fs,0);let[e,t,r,u,d,f]=Fs;e<i&&(i=e),u>s&&(s=u),t<a&&(a=t),d>c&&(c=d),r<o&&(o=r),f>l&&(l=f)}return n[r+0]=i,n[r+1]=a,n[r+2]=o,n[r+3]=s,n[r+4]=c,n[r+5]=l,n}computePrimitiveBounds(e,t,n){let r=n.offset||0;for(let i=e,a=e+t;i<a;i++){this.writePrimitiveBounds(i,Fs,0);let[e,t,a,o,s,c]=Fs,l=(e+o)/2,u=(t+s)/2,d=(a+c)/2,f=(o-e)/2,p=(s-t)/2,m=(c-a)/2,h=(i-r)*6;n[h+0]=l,n[h+1]=f+(Math.abs(l)+f)*Po,n[h+2]=u,n[h+3]=p+(Math.abs(u)+p)*Po,n[h+4]=d,n[h+5]=m+(Math.abs(d)+m)*Po}return n}shiftPrimitiveOffsets(e){let t=this._indirectBuffer;if(t)for(let n=0,r=t.length;n<r;n++)t[n]+=e;else{let t=this._roots;for(let n=0;n<t.length;n++){let r=t[n],i=new Uint32Array(r),a=new Uint16Array(r),o=r.byteLength/32;for(let t=0;t<o;t++){let n=8*t;Uo(2*n,a)&&(i[n+6]+=e)}}}}traverse(e,t=0){Ns.setBVH(this,t),Ns.traverse(e),Ns.reset()}refit(){let e=this._roots;for(let t=0,n=e.length;t<n;t++){let n=e[t],r=new Uint32Array(n),i=new Uint16Array(n),a=new Float32Array(n),o=n.byteLength/32;for(let e=o-1;e>=0;e--){let t=e*8,n=t*2;if(Uo(n,i)){let e=Wo(t,r),o=Go(n,i);this.writePrimitiveRangeBounds(e,o,Fs,0),a.set(Fs,t)}else{let e=Ko(t),n=qo(t,r);for(let r=0;r<3;r++){let i=a[e+r],o=a[e+r+3],s=a[n+r],c=a[n+r+3];a[t+r]=i<s?i:s,a[t+r+3]=o>c?o:c}}}}}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(t=>{Lo(0,new Float32Array(t),Ps),e.union(Ps)}),e}shapecast(e){let{boundsTraverseOrder:t,intersectsBounds:n,intersectsRange:r,intersectsPrimitive:i,scratchPrimitive:a,iterate:o}=e;if(r&&i){let e=r;r=(t,n,r,s,c)=>e(t,n,r,s,c)?!0:o(t,n,this,i,r,s,a)}else r||=i?(e,t,n,r)=>o(e,t,this,i,n,r,a):(e,t,n)=>n;let s=!1,c=0,l=this._roots;for(let e=0,i=l.length;e<i;e++){let i=l[e];if(s=xs(this,e,n,r,t,c),s)break;c+=i.byteLength/32}return s}bvhcast(e,t,n){let{intersectsRanges:r}=n;return js(this,e,t,r)}};function Ls(){return typeof SharedArrayBuffer<`u`}function Rs(e){return e.index?e.index.count:e.attributes.position.count}function zs(e){return Rs(e)/3}function Bs(e,t=ArrayBuffer){return e>65535?new Uint32Array(new t(4*e)):new Uint16Array(new t(2*e))}function Vs(e,t){if(!e.index){let n=e.attributes.position.count,r=Bs(n,t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer);e.setIndex(new Xe(r,1));for(let e=0;e<n;e++)r[e]=e}}function Hs(e,t,n){let r=Rs(e)/n,i=t||e.drawRange,a=i.start/n,o=(i.start+i.count)/n,s=Math.max(0,a),c=Math.min(r,o)-s;return{offset:Math.floor(s),count:Math.floor(c)}}function Us(e,t){return e.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function Ws(e,t,n){let r=Hs(e,t,n),i=Us(e,n);if(!i.length)return[r];let a=[],o=r.offset,s=r.offset+r.count,c=Rs(e)/n,l=[];for(let e of i){let{offset:t,count:n}=e,r=t,i=t+(isFinite(n)?n:c-t);r<s&&i>o&&(l.push({pos:Math.max(o,r),isStart:!0}),l.push({pos:Math.min(s,i),isStart:!1}))}l.sort((e,t)=>e.pos===t.pos?e.type===`end`?-1:1:e.pos-t.pos);let u=0,d=null;for(let e of l){let t=e.pos;u!==0&&t!==d&&a.push({offset:d,count:t-d}),u+=e.isStart?1:-1,d=t}return a}function Gs(e,t){let n=e[e.length-1],r=n.offset+n.count>2**16,i=e.reduce((e,t)=>e+t.count,0),a=r?4:2,o=t?new SharedArrayBuffer(i*a):new ArrayBuffer(i*a),s=r?new Uint32Array(o):new Uint16Array(o),c=0;for(let t=0;t<e.length;t++){let{offset:n,count:r}=e[t];for(let e=0;e<r;e++)s[c+e]=n+e;c+=r}return s}var Ks=class extends Is{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(e){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(e){}constructor(e,t={}){if(!e.isBufferGeometry)throw Error(`BVH: Only BufferGeometries are supported.`);if(e.index&&e.index.isInterleavedBufferAttribute)throw Error(`BVH: InterleavedBufferAttribute is not supported for the index attribute.`);if(t.useSharedArrayBuffer&&!Ls())throw Error(`BVH: SharedArrayBuffer is not available.`);super(),this.geometry=e,this.resolvePrimitiveIndex=t.indirect?e=>this._indirectBuffer[e]:e=>e,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,t={...Io,...t},t[Fo]||this.init(t)}init(e){let{geometry:t,primitiveStride:n}=this;if(e.indirect){let r=Gs(Ws(t,e.range,n),e.useSharedArrayBuffer);this._indirectBuffer=r}else Vs(t,e);super.init(e),!t.boundingBox&&e.setBoundingBox&&(t.boundingBox=this.getBoundingBox(new ft))}getRootRanges(e){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:Ws(this.geometry,e,this.primitiveStride)}raycastObject3D(){throw Error(`BVH: raycastObject3D() not implemented`)}},qs=class{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let n=1/0,r=-1/0;for(let i=0,a=e.length;i<a;i++){let a=e[i][t];n=a<n?a:n,r=a>r?a:r}this.min=n,this.max=r}setFromPoints(e,t){let n=1/0,r=-1/0;for(let i=0,a=t.length;i<a;i++){let a=t[i],o=e.dot(a);n=o<n?o:n,r=o>r?o:r}this.min=n,this.max=r}isSeparated(e){return this.min>e.max||e.min>this.max}};qs.prototype.setFromBox=(function(){let e=new U;return function(t,n){let r=n.min,i=n.max,a=1/0,o=-1/0;for(let n=0;n<=1;n++)for(let s=0;s<=1;s++)for(let c=0;c<=1;c++){e.x=r.x*n+i.x*(1-n),e.y=r.y*s+i.y*(1-s),e.z=r.z*c+i.z*(1-c);let l=t.dot(e);a=Math.min(l,a),o=Math.max(l,o)}this.min=a,this.max=o}})();var Js=(function(){let e=new U,t=new U,n=new U;return function(r,i,a){let o=r.start,s=e,c=i.start,l=t;n.subVectors(o,c),e.subVectors(r.end,r.start),t.subVectors(i.end,i.start);let u=n.dot(l),d=l.dot(s),f=l.dot(l),p=n.dot(s),m=s.dot(s)*f-d*d,h,g;h=m===0?0:(u*d-p*f)/m,g=(u+h*d)/f,a.x=h,a.y=g}})(),Ys=(function(){let e=new V,t=new U,n=new U;return function(r,i,a,o){Js(r,i,e);let s=e.x,c=e.y;if(s>=0&&s<=1&&c>=0&&c<=1){r.at(s,a),i.at(c,o);return}else if(s>=0&&s<=1){c<0?i.at(0,o):i.at(1,o),r.closestPointToPoint(o,!0,a);return}else if(c>=0&&c<=1){s<0?r.at(0,a):r.at(1,a),i.closestPointToPoint(a,!0,o);return}else{let e;e=s<0?r.start:r.end;let l;l=c<0?i.start:i.end;let u=t,d=n;if(r.closestPointToPoint(l,!0,t),i.closestPointToPoint(e,!0,n),u.distanceToSquared(l)<=d.distanceToSquared(e)){a.copy(u),o.copy(l);return}else{a.copy(e),o.copy(d);return}}}})(),Xs=(function(){let e=new U,t=new U,n=new P,r=new S;return function(i,a){let{radius:o,center:s}=i,{a:c,b:l,c:u}=a;if(r.start=c,r.end=l,r.closestPointToPoint(s,!0,e).distanceTo(s)<=o||(r.start=c,r.end=u,r.closestPointToPoint(s,!0,e).distanceTo(s)<=o)||(r.start=l,r.end=u,r.closestPointToPoint(s,!0,e).distanceTo(s)<=o))return!0;let d=a.getPlane(n);if(Math.abs(d.distanceToPoint(s))<=o){let e=d.projectPoint(s,t);if(a.containsPoint(e))return!0}return!1}})(),Zs=[`x`,`y`,`z`],Qs=1e-15,$s=Qs*Qs;function ec(e){return Math.abs(e)<Qs}var tc=class extends me{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=[,,,,].fill().map(()=>new U),this.satBounds=[,,,,].fill().map(()=>new qs),this.points=[this.a,this.b,this.c],this.plane=new P,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new S,this.needsUpdate=!0}intersectsSphere(e){return Xs(e,this)}update(){let e=this.a,t=this.b,n=this.c,r=this.points,i=this.satAxes,a=this.satBounds,o=i[0],s=a[0];this.getNormal(o),s.setFromPoints(o,r);let c=i[1],l=a[1];c.subVectors(e,t),l.setFromPoints(c,r);let u=i[2],d=a[2];u.subVectors(t,n),d.setFromPoints(u,r);let f=i[3],p=a[3];f.subVectors(n,e),p.setFromPoints(f,r);let m=c.length(),h=u.length(),g=f.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,m<Qs?h<Qs||g<Qs?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(n)):h<Qs?g<Qs?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(e)):g<Qs&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(t)),this.plane.setFromNormalAndCoplanarPoint(o,e),this.needsUpdate=!1}};tc.prototype.closestPointToSegment=(function(){let e=new U,t=new U,n=new S;return function(r,i=null,a=null){let{start:o,end:s}=r,c=this.points,l,u=1/0;for(let o=0;o<3;o++){let s=(o+1)%3;n.start.copy(c[o]),n.end.copy(c[s]),Ys(n,r,e,t),l=e.distanceToSquared(t),l<u&&(u=l,i&&i.copy(e),a&&a.copy(t))}return this.closestPointToPoint(o,e),l=o.distanceToSquared(e),l<u&&(u=l,i&&i.copy(e),a&&a.copy(o)),this.closestPointToPoint(s,e),l=s.distanceToSquared(e),l<u&&(u=l,i&&i.copy(e),a&&a.copy(s)),Math.sqrt(u)}})(),tc.prototype.intersectsTriangle=(function(){let e=new tc,t=new qs,n=new qs,r=new U,i=new U,a=new U,o=new U,s=new S,c=new S,l=new U,u=new V,d=new V;function f(e,i,a,s){let c=r;!e.isDegenerateIntoPoint&&!e.isDegenerateIntoSegment?c.copy(e.plane.normal):c.copy(i.plane.normal);let l=e.satBounds,u=e.satAxes;for(let r=1;r<4;r++){let a=l[r],s=u[r];if(t.setFromPoints(s,i.points),a.isSeparated(t)||(o.copy(c).cross(s),t.setFromPoints(o,e.points),n.setFromPoints(o,i.points),t.isSeparated(n)))return!1}let d=i.satBounds,f=i.satAxes;for(let r=1;r<4;r++){let a=d[r],s=f[r];if(t.setFromPoints(s,e.points),a.isSeparated(t)||(o.crossVectors(c,s),t.setFromPoints(o,e.points),n.setFromPoints(o,i.points),t.isSeparated(n)))return!1}return a&&(s||console.warn(`ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0.`),a.start.set(0,0,0),a.end.set(0,0,0)),!0}function p(e,t,n,r,i,a,o,s,c,l,u){let d=o/(o-s);l.x=r+(i-r)*d,u.start.subVectors(t,e).multiplyScalar(d).add(e),d=o/(o-c),l.y=r+(a-r)*d,u.end.subVectors(n,e).multiplyScalar(d).add(e)}function m(e,t,n,r,i,a,o,s,c,l,u){if(i>0)p(e.c,e.a,e.b,r,t,n,c,o,s,l,u);else if(a>0)p(e.b,e.a,e.c,n,t,r,s,o,c,l,u);else if(s*c>0||o!=0)p(e.a,e.b,e.c,t,n,r,o,s,c,l,u);else if(s!=0)p(e.b,e.a,e.c,n,t,r,s,o,c,l,u);else if(c!=0)p(e.c,e.a,e.b,r,t,n,c,o,s,l,u);else return!0;return!1}function h(e,t,n,i){let a=t.degenerateSegment,o=e.plane.distanceToPoint(a.start),s=e.plane.distanceToPoint(a.end);return ec(o)?ec(s)?f(e,t,n,i):(n&&(n.start.copy(a.start),n.end.copy(a.start)),e.containsPoint(a.start)):ec(s)?(n&&(n.start.copy(a.end),n.end.copy(a.end)),e.containsPoint(a.end)):e.plane.intersectLine(a,r)==null?!1:(n&&(n.start.copy(r),n.end.copy(r)),e.containsPoint(r))}function g(e,t,n){let r=t.a;return ec(e.plane.distanceToPoint(r))&&e.containsPoint(r)?(n&&(n.start.copy(r),n.end.copy(r)),!0):!1}function _(e,t,n){let i=e.degenerateSegment,a=t.a;return i.closestPointToPoint(a,!0,r),a.distanceToSquared(r)<$s?(n&&(n.start.copy(a),n.end.copy(a)),!0):!1}function v(e,t,n,o){if(e.isDegenerateIntoSegment)if(t.isDegenerateIntoSegment){let o=e.degenerateSegment,s=t.degenerateSegment,c=i,l=a;o.delta(c),s.delta(l);let u=r.subVectors(s.start,o.start),d=c.x*l.y-c.y*l.x;if(ec(d))return!1;let f=(u.x*l.y-u.y*l.x)/d,p=-(c.x*u.y-c.y*u.x)/d;return f<0||f>1||p<0||p>1?!1:ec(o.start.z+c.z*f-(s.start.z+l.z*p))?(n&&(n.start.copy(o.start).addScaledVector(c,f),n.end.copy(o.start).addScaledVector(c,f)),!0):!1}else if(t.isDegenerateIntoPoint)return _(e,t,n);else return h(t,e,n,o);else if(e.isDegenerateIntoPoint)return t.isDegenerateIntoPoint?t.a.distanceToSquared(e.a)<$s?(n&&(n.start.copy(e.a),n.end.copy(e.a)),!0):!1:t.isDegenerateIntoSegment?_(t,e,n):g(t,e,n);else if(t.isDegenerateIntoPoint)return g(e,t,n);else if(t.isDegenerateIntoSegment)return h(e,t,n,o)}return function(t,n=null,r=!1){this.needsUpdate&&this.update(),t.isExtendedTriangle?t.needsUpdate&&t.update():(e.copy(t),e.update(),t=e);let o=v(this,t,n,r);if(o!==void 0)return o;let p=this.plane,h=t.plane,g=h.distanceToPoint(this.a),_=h.distanceToPoint(this.b),y=h.distanceToPoint(this.c);ec(g)&&(g=0),ec(_)&&(_=0),ec(y)&&(y=0);let b=g*_,x=g*y;if(b>0&&x>0)return!1;let S=p.distanceToPoint(t.a),C=p.distanceToPoint(t.b),w=p.distanceToPoint(t.c);ec(S)&&(S=0),ec(C)&&(C=0),ec(w)&&(w=0);let T=S*C,E=S*w;if(T>0&&E>0)return!1;i.copy(p.normal),a.copy(h.normal);let D=i.cross(a),O=0,ee=Math.abs(D.x),k=Math.abs(D.y);k>ee&&(ee=k,O=1),Math.abs(D.z)>ee&&(O=2);let A=Zs[O],j=this.a[A],te=this.b[A],M=this.c[A],ne=t.a[A],re=t.b[A],ie=t.c[A];if(m(this,j,te,M,b,x,g,_,y,u,s)||m(t,ne,re,ie,T,E,S,C,w,d,c))return f(this,t,n,r);if(u.y<u.x){let e=u.y;u.y=u.x,u.x=e,l.copy(s.start),s.start.copy(s.end),s.end.copy(l)}if(d.y<d.x){let e=d.y;d.y=d.x,d.x=e,l.copy(c.start),c.start.copy(c.end),c.end.copy(l)}return u.y<d.x||d.y<u.x?!1:(n&&(d.x>u.x?n.start.copy(c.start):n.start.copy(s.start),d.y<u.y?n.end.copy(c.end):n.end.copy(s.end)),!0)}})(),tc.prototype.distanceToPoint=(function(){let e=new U;return function(t){return this.closestPointToPoint(t,e),t.distanceTo(e)}})(),tc.prototype.distanceToTriangle=(function(){let e=new U,t=new U,n=[`a`,`b`,`c`],r=new S,i=new S;return function(a,o=null,s=null){let c=o||s?r:null;if(this.intersectsTriangle(a,c,!0))return(o||s)&&(o&&c.getCenter(o),s&&c.getCenter(s)),0;let l=1/0;for(let t=0;t<3;t++){let r,i=n[t],c=a[i];this.closestPointToPoint(c,e),r=c.distanceToSquared(e),r<l&&(l=r,o&&o.copy(e),s&&s.copy(c));let u=this[i];a.closestPointToPoint(u,e),r=u.distanceToSquared(e),r<l&&(l=r,o&&o.copy(u),s&&s.copy(e))}for(let c=0;c<3;c++){let u=n[c],d=n[(c+1)%3];r.set(this[u],this[d]);for(let c=0;c<3;c++){let u=n[c],d=n[(c+1)%3];i.set(a[u],a[d]),Ys(r,i,e,t);let f=e.distanceToSquared(t);f<l&&(l=f,o&&o.copy(e),s&&s.copy(t))}}return Math.sqrt(l)}})();var nc=class{constructor(e,t,n){this.isOrientedBox=!0,this.min=new U,this.max=new U,this.matrix=new yt,this.invMatrix=new yt,this.points=Array(8).fill().map(()=>new U),this.satAxes=[,,,].fill().map(()=>new U),this.satBounds=[,,,].fill().map(()=>new qs),this.alignedSatBounds=[,,,].fill().map(()=>new qs),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),n&&this.matrix.copy(n)}set(e,t,n){this.min.copy(e),this.max.copy(t),this.matrix.copy(n),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}};nc.prototype.update=(function(){return function(){let e=this.matrix,t=this.min,n=this.max,r=this.points;for(let i=0;i<=1;i++)for(let a=0;a<=1;a++)for(let o=0;o<=1;o++){let s=r[1*i|2*a|4*o];s.x=i?n.x:t.x,s.y=a?n.y:t.y,s.z=o?n.z:t.z,s.applyMatrix4(e)}let i=this.satBounds,a=this.satAxes,o=r[0];for(let e=0;e<3;e++){let t=a[e],n=i[e],s=r[1<<e];t.subVectors(o,s),n.setFromPoints(t,r)}let s=this.alignedSatBounds;s[0].setFromPointsField(r,`x`),s[1].setFromPointsField(r,`y`),s[2].setFromPointsField(r,`z`),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})(),nc.prototype.intersectsBox=(function(){let e=new qs;return function(t){this.needsUpdate&&this.update();let n=t.min,r=t.max,i=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(e.min=n.x,e.max=r.x,o[0].isSeparated(e)||(e.min=n.y,e.max=r.y,o[1].isSeparated(e))||(e.min=n.z,e.max=r.z,o[2].isSeparated(e)))return!1;for(let n=0;n<3;n++){let r=a[n],o=i[n];if(e.setFromBox(r,t),o.isSeparated(e))return!1}return!0}})(),nc.prototype.intersectsTriangle=(function(){let e=new tc,t=[,,,],n=new qs,r=new qs,i=new U;return function(a){this.needsUpdate&&this.update(),a.isExtendedTriangle?a.needsUpdate&&a.update():(e.copy(a),e.update(),a=e);let o=this.satBounds,s=this.satAxes;t[0]=a.a,t[1]=a.b,t[2]=a.c;for(let e=0;e<3;e++){let r=o[e],i=s[e];if(n.setFromPoints(i,t),r.isSeparated(n))return!1}let c=a.satBounds,l=a.satAxes,u=this.points;for(let e=0;e<3;e++){let t=c[e],r=l[e];if(n.setFromPoints(r,u),t.isSeparated(n))return!1}for(let e=0;e<3;e++){let a=s[e];for(let e=0;e<4;e++){let o=l[e];if(i.crossVectors(a,o),n.setFromPoints(i,t),r.setFromPoints(i,u),n.isSeparated(r))return!1}}return!0}})(),nc.prototype.closestPointToPoint=(function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}})(),nc.prototype.distanceToPoint=(function(){let e=new U;return function(t){return this.closestPointToPoint(t,e),t.distanceTo(e)}})(),nc.prototype.distanceToBox=(function(){let e=[`x`,`y`,`z`],t=Array(12).fill().map(()=>new S),n=Array(12).fill().map(()=>new S),r=new U,i=new U;return function(a,o=0,s=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(a))return(s||c)&&(a.getCenter(i),this.closestPointToPoint(i,r),a.closestPointToPoint(r,i),s&&s.copy(r),c&&c.copy(i)),0;let l=o*o,u=a.min,d=a.max,f=this.points,p=1/0;for(let e=0;e<8;e++){let t=f[e];i.copy(t).clamp(u,d);let n=t.distanceToSquared(i);if(n<p&&(p=n,s&&s.copy(t),c&&c.copy(i),n<l))return Math.sqrt(n)}let m=0;for(let r=0;r<3;r++)for(let i=0;i<=1;i++)for(let a=0;a<=1;a++){let o=(r+1)%3,s=(r+2)%3,c=i<<o|a<<s,l=1<<r|i<<o|a<<s,p=f[c],h=f[l];t[m].set(p,h);let g=e[r],_=e[o],v=e[s],y=n[m],b=y.start,x=y.end;b[g]=u[g],b[_]=i?u[_]:d[_],b[v]=a?u[v]:d[_],x[g]=d[g],x[_]=i?u[_]:d[_],x[v]=a?u[v]:d[_],m++}for(let e=0;e<=1;e++)for(let t=0;t<=1;t++)for(let n=0;n<=1;n++){i.x=e?d.x:u.x,i.y=t?d.y:u.y,i.z=n?d.z:u.z,this.closestPointToPoint(i,r);let a=i.distanceToSquared(r);if(a<p&&(p=a,s&&s.copy(r),c&&c.copy(i),a<l))return Math.sqrt(a)}for(let e=0;e<12;e++){let a=t[e];for(let e=0;e<12;e++){let t=n[e];Ys(a,t,r,i);let o=r.distanceToSquared(i);if(o<p&&(p=o,s&&s.copy(r),c&&c.copy(i),o<l))return Math.sqrt(o)}}return Math.sqrt(p)}})();var rc=new class extends hs{constructor(){super(()=>new tc)}},ic=new U,ac=new U;function oc(e,t,n={},r=0,i=1/0){let a=r*r,o=i*i,s=1/0,c=null;if(e.shapecast({boundsTraverseOrder:e=>(ic.copy(t).clamp(e.min,e.max),ic.distanceToSquared(t)),intersectsBounds:(e,t,n)=>n<s&&n<o,intersectsTriangle:(e,n)=>{e.closestPointToPoint(t,ic);let r=t.distanceToSquared(ic);return r<s&&(ac.copy(ic),s=r,c=n),r<a}}),s===1/0)return null;let l=Math.sqrt(s);return n.point?n.point.copy(ac):n.point=ac.clone(),n.distance=l,n.faceIndex=c,n}var sc=!0,cc=new U,lc=new U,uc=new U,dc=new V,fc=new V,pc=new V,mc=new U,hc=new U,gc=new U,_c=new U;function vc(e,t,n,r,i,a,o,s){let c;if(c=a===1?e.intersectTriangle(r,n,t,!0,i):e.intersectTriangle(t,n,r,a!==2,i),c===null)return null;let l=e.origin.distanceTo(i);return l<o||l>s?null:{distance:l,point:i.clone()}}function yc(e,t,n,r,i,a,o,s,c,l,u){cc.fromBufferAttribute(t,a),lc.fromBufferAttribute(t,o),uc.fromBufferAttribute(t,s);let d=vc(e,cc,lc,uc,_c,c,l,u);if(d){if(r){dc.fromBufferAttribute(r,a),fc.fromBufferAttribute(r,o),pc.fromBufferAttribute(r,s),d.uv=new V;let e=me.getInterpolation(_c,cc,lc,uc,dc,fc,pc,d.uv);sc||(d.uv=e)}if(i){dc.fromBufferAttribute(i,a),fc.fromBufferAttribute(i,o),pc.fromBufferAttribute(i,s),d.uv1=new V;let e=me.getInterpolation(_c,cc,lc,uc,dc,fc,pc,d.uv1);sc||(d.uv1=e)}if(n){mc.fromBufferAttribute(n,a),hc.fromBufferAttribute(n,o),gc.fromBufferAttribute(n,s),d.normal=new U;let t=me.getInterpolation(_c,cc,lc,uc,mc,hc,gc,d.normal);d.normal.dot(e.direction)>0&&d.normal.multiplyScalar(-1),sc||(d.normal=t)}let t={a,b:o,c:s,normal:new U,materialIndex:0};if(me.getNormal(cc,lc,uc,t.normal),d.face=t,d.faceIndex=a,sc){let e=new U;me.getBarycoord(_c,cc,lc,uc,e),d.barycoord=e}}return d}function bc(e){return e&&e.isMaterial?e.side:e}function xc(e,t,n,r,i,a,o){let s=r*3,c=s+0,l=s+1,u=s+2,{index:d,groups:f}=e;e.index&&(c=d.getX(c),l=d.getX(l),u=d.getX(u));let{position:p,normal:m,uv:h,uv1:g}=e.attributes;if(Array.isArray(t)){let e=r*3;for(let s=0,d=f.length;s<d;s++){let{start:d,count:_,materialIndex:v}=f[s];if(e>=d&&e<d+_){let e=bc(t[v]),s=yc(n,p,m,h,g,c,l,u,e,a,o);if(s)if(s.faceIndex=r,s.face.materialIndex=v,i)i.push(s);else return s}}}else{let e=bc(t),s=yc(n,p,m,h,g,c,l,u,e,a,o);if(s)if(s.faceIndex=r,s.face.materialIndex=0,i)i.push(s);else return s}return null}function Sc(e,t,n,r){let i=e.a,a=e.b,o=e.c,s=t,c=t+1,l=t+2;n&&(s=n.getX(s),c=n.getX(c),l=n.getX(l)),i.x=r.getX(s),i.y=r.getY(s),i.z=r.getZ(s),a.x=r.getX(c),a.y=r.getY(c),a.z=r.getZ(c),o.x=r.getX(l),o.y=r.getY(l),o.z=r.getZ(l)}function Cc(e,t,n,r,i,a,o,s){let{geometry:c,_indirectBuffer:l}=e;for(let e=r,l=r+i;e<l;e++)xc(c,t,n,e,a,o,s)}function wc(e,t,n,r,i,a,o){let{geometry:s,_indirectBuffer:c}=e,l=1/0,u=null;for(let e=r,c=r+i;e<c;e++){let r;r=xc(s,t,n,e,null,a,o),r&&r.distance<l&&(u=r,l=r.distance)}return u}function Tc(e,t,n,r,i,a,o){let{geometry:s}=n,{index:c}=s,l=s.attributes.position;for(let n=e,s=t+e;n<s;n++){let e;if(e=n,Sc(o,e*3,c,l),o.needsUpdate=!0,r(o,e,i,a))return!0}return!1}function Ec(e,t=null){t&&Array.isArray(t)&&(t=new Set(t));let n=e.geometry,r=n.index?n.index.array:null,i=n.attributes.position,a,o,s,c,l=0,u=e._roots;for(let e=0,t=u.length;e<t;e++)a=u[e],o=new Uint32Array(a),s=new Uint16Array(a),c=new Float32Array(a),d(0,l),l+=a.byteLength;function d(e,n,a=!1){let l=e*2;if(Uo(l,s)){let t=Wo(e,o),n=Go(l,s),a=1/0,u=1/0,d=1/0,f=-1/0,p=-1/0,m=-1/0;for(let e=3*t,o=3*(t+n);e<o;e++){let t=r[e],n=i.getX(t),o=i.getY(t),s=i.getZ(t);n<a&&(a=n),n>f&&(f=n),o<u&&(u=o),o>p&&(p=o),s<d&&(d=s),s>m&&(m=s)}return c[e+0]!==a||c[e+1]!==u||c[e+2]!==d||c[e+3]!==f||c[e+4]!==p||c[e+5]!==m?(c[e+0]=a,c[e+1]=u,c[e+2]=d,c[e+3]=f,c[e+4]=p,c[e+5]=m,!0):!1}else{let r=Ko(e),i=qo(e,o),s=a,l=!1,u=!1;if(t){if(!s){let e=r/8+n/32,a=i/8+n/32;l=t.has(e),u=t.has(a),s=!l&&!u}}else l=!0,u=!0;let f=s||l,p=s||u,m=!1;f&&(m=d(r,n,s));let h=!1;p&&(h=d(i,n,s));let g=m||h;if(g)for(let t=0;t<3;t++){let n=r+t,a=i+t,o=c[n],s=c[n+3],l=c[a],u=c[a+3];c[e+t]=o<l?o:l,c[e+t+3]=s>u?s:u}return g}}}function Dc(e,t,n,r,i){let a,o,s,c,l,u,d=1/n.direction.x,f=1/n.direction.y,p=1/n.direction.z,m=n.origin.x,h=n.origin.y,g=n.origin.z,_=t[e],v=t[e+3],y=t[e+1],b=t[e+3+1],x=t[e+2],S=t[e+3+2];return d>=0?(a=(_-m)*d,o=(v-m)*d):(a=(v-m)*d,o=(_-m)*d),f>=0?(s=(y-h)*f,c=(b-h)*f):(s=(b-h)*f,c=(y-h)*f),a>c||s>o||((s>a||isNaN(a))&&(a=s),(c<o||isNaN(o))&&(o=c),p>=0?(l=(x-g)*p,u=(S-g)*p):(l=(S-g)*p,u=(x-g)*p),a>u||l>o)?!1:((l>a||a!==a)&&(a=l),(u<o||o!==o)&&(o=u),a<=i&&o>=r)}function Oc(e,t,n,r,i,a,o,s){let{geometry:c,_indirectBuffer:l}=e;for(let e=r,u=r+i;e<u;e++)xc(c,t,n,l?l[e]:e,a,o,s)}function kc(e,t,n,r,i,a,o){let{geometry:s,_indirectBuffer:c}=e,l=1/0,u=null;for(let e=r,d=r+i;e<d;e++){let r;r=xc(s,t,n,c?c[e]:e,null,a,o),r&&r.distance<l&&(u=r,l=r.distance)}return u}function Ac(e,t,n,r,i,a,o){let{geometry:s}=n,{index:c}=s,l=s.attributes.position;for(let s=e,u=t+e;s<u;s++){let e;if(e=n.resolveTriangleIndex(s),Sc(o,e*3,c,l),o.needsUpdate=!0,r(o,e,i,a))return!0}return!1}function jc(e,t,n,r,i,a,o){gs.setBuffer(e._roots[t]),Mc(0,e,n,r,i,a,o),gs.clearBuffer()}function Mc(e,t,n,r,i,a,o){let{float32Array:s,uint16Array:c,uint32Array:l}=gs,u=e*2;if(Uo(u,c))Cc(t,n,r,Wo(e,l),Go(u,c),i,a,o);else{let c=Ko(e);Dc(c,s,r,a,o)&&Mc(c,t,n,r,i,a,o);let u=qo(e,l);Dc(u,s,r,a,o)&&Mc(u,t,n,r,i,a,o)}}var Nc=[`x`,`y`,`z`];function Pc(e,t,n,r,i,a){gs.setBuffer(e._roots[t]);let o=Fc(0,e,n,r,i,a);return gs.clearBuffer(),o}function Fc(e,t,n,r,i,a){let{float32Array:o,uint16Array:s,uint32Array:c}=gs,l=e*2;if(Uo(l,s))return wc(t,n,r,Wo(e,c),Go(l,s),i,a);{let s=Jo(e,c),l=Nc[s],u=r.direction[l]>=0,d,f;u?(d=Ko(e),f=qo(e,c)):(d=qo(e,c),f=Ko(e));let p=Dc(d,o,r,i,a)?Fc(d,t,n,r,i,a):null;if(p){let e=p.point[l];if(u?e<=o[f+s]:e>=o[f+s+3])return p}let m=Dc(f,o,r,i,a)?Fc(f,t,n,r,i,a):null;return p&&m?p.distance<=m.distance?p:m:p||m||null}}var Ic=new ft,Lc=new tc,Rc=new tc,zc=new yt,Bc=new nc,Vc=new nc;function Hc(e,t,n,r){gs.setBuffer(e._roots[t]);let i=Uc(0,e,n,r);return gs.clearBuffer(),i}function Uc(e,t,n,r,i=null){let{float32Array:a,uint16Array:o,uint32Array:s}=gs,c=e*2;if(i===null&&(n.boundingBox||n.computeBoundingBox(),Bc.set(n.boundingBox.min,n.boundingBox.max,r),i=Bc),Uo(c,o)){let i=t.geometry,l=i.index,u=i.attributes.position,d=n.index,f=n.attributes.position,p=Wo(e,s),m=Go(c,o);if(zc.copy(r).invert(),n.boundsTree)return Lo(Yo(e),a,Vc),Vc.matrix.copy(zc),Vc.needsUpdate=!0,n.boundsTree.shapecast({intersectsBounds:e=>Vc.intersectsBox(e),intersectsTriangle:e=>{e.a.applyMatrix4(r),e.b.applyMatrix4(r),e.c.applyMatrix4(r),e.needsUpdate=!0;for(let t=p*3,n=(m+p)*3;t<n;t+=3)if(Sc(Rc,t,l,u),Rc.needsUpdate=!0,e.intersectsTriangle(Rc))return!0;return!1}});{let e=zs(n);for(let t=p*3,n=(m+p)*3;t<n;t+=3){Sc(Lc,t,l,u),Lc.a.applyMatrix4(zc),Lc.b.applyMatrix4(zc),Lc.c.applyMatrix4(zc),Lc.needsUpdate=!0;for(let t=0,n=e*3;t<n;t+=3)if(Sc(Rc,t,d,f),Rc.needsUpdate=!0,Lc.intersectsTriangle(Rc))return!0}}}else{let o=Ko(e),c=qo(e,s);return Lo(Yo(o),a,Ic),!!(i.intersectsBox(Ic)&&Uc(o,t,n,r,i)||(Lo(Yo(c),a,Ic),i.intersectsBox(Ic)&&Uc(c,t,n,r,i)))}}var Wc=new yt,Gc=new nc,Kc=new nc,qc=new U,Jc=new U,Yc=new U,Xc=new U;function Zc(e,t,n,r={},i={},a=0,o=1/0){t.boundingBox||t.computeBoundingBox(),Gc.set(t.boundingBox.min,t.boundingBox.max,n),Gc.needsUpdate=!0;let s=e.geometry,c=s.attributes.position,l=s.index,u=t.attributes.position,d=t.index,f=rc.getPrimitive(),p=rc.getPrimitive(),m=qc,h=Jc,g=null,_=null;i&&(g=Yc,_=Xc);let v=1/0,y=null,b=null;return Wc.copy(n).invert(),Kc.matrix.copy(Wc),e.shapecast({boundsTraverseOrder:e=>Gc.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o?(t&&(Kc.min.copy(e.min),Kc.max.copy(e.max),Kc.needsUpdate=!0),!0):!1,intersectsRange:(e,r)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:e=>Kc.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o,intersectsRange:(t,i)=>{for(let o=t,s=t+i;o<s;o++){Sc(p,3*o,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let t=e,n=e+r;t<n;t++){Sc(f,3*t,l,c),f.needsUpdate=!0;let e=f.distanceToTriangle(p,m,g);if(e<v&&(h.copy(m),_&&_.copy(g),v=e,y=t,b=o),e<a)return!0}}}});{let i=zs(t);for(let t=0,o=i;t<o;t++){Sc(p,3*t,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let n=e,i=e+r;n<i;n++){Sc(f,3*n,l,c),f.needsUpdate=!0;let e=f.distanceToTriangle(p,m,g);if(e<v&&(h.copy(m),_&&_.copy(g),v=e,y=n,b=t),e<a)return!0}}}}}),rc.releasePrimitive(f),rc.releasePrimitive(p),v===1/0?null:(r.point?r.point.copy(h):r.point=h.clone(),r.distance=v,r.faceIndex=y,i&&(i.point?i.point.copy(_):i.point=_.clone(),i.point.applyMatrix4(Wc),h.applyMatrix4(Wc),i.distance=h.sub(i.point).length(),i.faceIndex=b),r)}function Qc(e,t=null){t&&Array.isArray(t)&&(t=new Set(t));let n=e.geometry,r=n.index?n.index.array:null,i=n.attributes.position,a,o,s,c,l=0,u=e._roots;for(let e=0,t=u.length;e<t;e++)a=u[e],o=new Uint32Array(a),s=new Uint16Array(a),c=new Float32Array(a),d(0,l),l+=a.byteLength;function d(n,a,l=!1){let u=n*2;if(Uo(u,s)){let t=Wo(n,o),a=Go(u,s),l=1/0,d=1/0,f=1/0,p=-1/0,m=-1/0,h=-1/0;for(let n=t,o=t+a;n<o;n++){let t=3*e.resolveTriangleIndex(n);for(let e=0;e<3;e++){let n=t+e;n=r?r[n]:n;let a=i.getX(n),o=i.getY(n),s=i.getZ(n);a<l&&(l=a),a>p&&(p=a),o<d&&(d=o),o>m&&(m=o),s<f&&(f=s),s>h&&(h=s)}}return c[n+0]!==l||c[n+1]!==d||c[n+2]!==f||c[n+3]!==p||c[n+4]!==m||c[n+5]!==h?(c[n+0]=l,c[n+1]=d,c[n+2]=f,c[n+3]=p,c[n+4]=m,c[n+5]=h,!0):!1}else{let e=Ko(n),r=qo(n,o),i=l,s=!1,u=!1;if(t){if(!i){let n=e/8+a/32,o=r/8+a/32;s=t.has(n),u=t.has(o),i=!s&&!u}}else s=!0,u=!0;let f=i||s,p=i||u,m=!1;f&&(m=d(e,a,i));let h=!1;p&&(h=d(r,a,i));let g=m||h;if(g)for(let t=0;t<3;t++){let i=e+t,a=r+t,o=c[i],s=c[i+3],l=c[a],u=c[a+3];c[n+t]=o<l?o:l,c[n+t+3]=s>u?s:u}return g}}}function $c(e,t,n,r,i,a,o){gs.setBuffer(e._roots[t]),el(0,e,n,r,i,a,o),gs.clearBuffer()}function el(e,t,n,r,i,a,o){let{float32Array:s,uint16Array:c,uint32Array:l}=gs,u=e*2;if(Uo(u,c))Oc(t,n,r,Wo(e,l),Go(u,c),i,a,o);else{let c=Ko(e);Dc(c,s,r,a,o)&&el(c,t,n,r,i,a,o);let u=qo(e,l);Dc(u,s,r,a,o)&&el(u,t,n,r,i,a,o)}}var tl=[`x`,`y`,`z`];function nl(e,t,n,r,i,a){gs.setBuffer(e._roots[t]);let o=rl(0,e,n,r,i,a);return gs.clearBuffer(),o}function rl(e,t,n,r,i,a){let{float32Array:o,uint16Array:s,uint32Array:c}=gs,l=e*2;if(Uo(l,s))return kc(t,n,r,Wo(e,c),Go(l,s),i,a);{let s=Jo(e,c),l=tl[s],u=r.direction[l]>=0,d,f;u?(d=Ko(e),f=qo(e,c)):(d=qo(e,c),f=Ko(e));let p=Dc(d,o,r,i,a)?rl(d,t,n,r,i,a):null;if(p){let e=p.point[l];if(u?e<=o[f+s]:e>=o[f+s+3])return p}let m=Dc(f,o,r,i,a)?rl(f,t,n,r,i,a):null;return p&&m?p.distance<=m.distance?p:m:p||m||null}}var il=new ft,al=new tc,ol=new tc,sl=new yt,cl=new nc,ll=new nc;function ul(e,t,n,r){gs.setBuffer(e._roots[t]);let i=dl(0,e,n,r);return gs.clearBuffer(),i}function dl(e,t,n,r,i=null){let{float32Array:a,uint16Array:o,uint32Array:s}=gs,c=e*2;if(i===null&&(n.boundingBox||n.computeBoundingBox(),cl.set(n.boundingBox.min,n.boundingBox.max,r),i=cl),Uo(c,o)){let i=t.geometry,l=i.index,u=i.attributes.position,d=n.index,f=n.attributes.position,p=Wo(e,s),m=Go(c,o);if(sl.copy(r).invert(),n.boundsTree)return Lo(Yo(e),a,ll),ll.matrix.copy(sl),ll.needsUpdate=!0,n.boundsTree.shapecast({intersectsBounds:e=>ll.intersectsBox(e),intersectsTriangle:e=>{e.a.applyMatrix4(r),e.b.applyMatrix4(r),e.c.applyMatrix4(r),e.needsUpdate=!0;for(let n=p,r=m+p;n<r;n++)if(Sc(ol,3*t.resolveTriangleIndex(n),l,u),ol.needsUpdate=!0,e.intersectsTriangle(ol))return!0;return!1}});{let e=zs(n);for(let n=p,r=m+p;n<r;n++){Sc(al,3*t.resolveTriangleIndex(n),l,u),al.a.applyMatrix4(sl),al.b.applyMatrix4(sl),al.c.applyMatrix4(sl),al.needsUpdate=!0;for(let t=0,n=e*3;t<n;t+=3)if(Sc(ol,t,d,f),ol.needsUpdate=!0,al.intersectsTriangle(ol))return!0}}}else{let o=Ko(e),c=qo(e,s);return Lo(Yo(o),a,il),!!(i.intersectsBox(il)&&dl(o,t,n,r,i)||(Lo(Yo(c),a,il),i.intersectsBox(il)&&dl(c,t,n,r,i)))}}var fl=new yt,pl=new nc,ml=new nc,hl=new U,gl=new U,_l=new U,vl=new U;function yl(e,t,n,r={},i={},a=0,o=1/0){t.boundingBox||t.computeBoundingBox(),pl.set(t.boundingBox.min,t.boundingBox.max,n),pl.needsUpdate=!0;let s=e.geometry,c=s.attributes.position,l=s.index,u=t.attributes.position,d=t.index,f=rc.getPrimitive(),p=rc.getPrimitive(),m=hl,h=gl,g=null,_=null;i&&(g=_l,_=vl);let v=1/0,y=null,b=null;return fl.copy(n).invert(),ml.matrix.copy(fl),e.shapecast({boundsTraverseOrder:e=>pl.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o?(t&&(ml.min.copy(e.min),ml.max.copy(e.max),ml.needsUpdate=!0),!0):!1,intersectsRange:(r,i)=>{if(t.boundsTree){let s=t.boundsTree;return s.shapecast({boundsTraverseOrder:e=>ml.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o,intersectsRange:(t,o)=>{for(let x=t,S=t+o;x<S;x++){let t=s.resolveTriangleIndex(x);Sc(p,3*t,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let t=r,n=r+i;t<n;t++){let n=e.resolveTriangleIndex(t);Sc(f,3*n,l,c),f.needsUpdate=!0;let r=f.distanceToTriangle(p,m,g);if(r<v&&(h.copy(m),_&&_.copy(g),v=r,y=t,b=x),r<a)return!0}}}})}else{let o=zs(t);for(let t=0,s=o;t<s;t++){Sc(p,3*t,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let n=r,o=r+i;n<o;n++){let r=e.resolveTriangleIndex(n);Sc(f,3*r,l,c),f.needsUpdate=!0;let i=f.distanceToTriangle(p,m,g);if(i<v&&(h.copy(m),_&&_.copy(g),v=i,y=n,b=t),i<a)return!0}}}}}),rc.releasePrimitive(f),rc.releasePrimitive(p),v===1/0?null:(r.point?r.point.copy(h):r.point=h.clone(),r.distance=v,r.faceIndex=y,i&&(i.point?i.point.copy(_):i.point=_.clone(),i.point.applyMatrix4(fl),h.applyMatrix4(fl),i.distance=h.sub(i.point).length(),i.faceIndex=b),r)}function bl(e,t,n){return e===null?null:(e.point.applyMatrix4(t.matrixWorld),e.distance=e.point.distanceTo(n.ray.origin),e.object=t,e)}var xl=new nc,Sl=new kt,Cl=new U,wl=new yt,Tl=new U,El=[`getX`,`getY`,`getZ`],Dl=class e extends Ks{static serialize(e,t={}){t={cloneBuffers:!0,...t};let n=e.geometry,r=e._roots,i=e._indirectBuffer,a=n.getIndex(),o={version:1,roots:null,index:null,indirectBuffer:null};return t.cloneBuffers?(o.roots=r.map(e=>e.slice()),o.index=a?a.array.slice():null,o.indirectBuffer=i?i.slice():null):(o.roots=r,o.index=a?a.array:null,o.indirectBuffer=i),o}static deserialize(t,n,r={}){r={setIndex:!0,indirect:!!t.indirectBuffer,...r};let{index:i,roots:a,indirectBuffer:o}=t;t.version||(console.warn(`MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data.`),c(a));let s=new e(n,{...r,[Fo]:!0});if(s._roots=a,s._indirectBuffer=o||null,r.setIndex){let e=n.getIndex();if(e===null){let e=new Xe(t.index,1,!1);n.setIndex(e)}else e.array!==i&&(e.array.set(i),e.needsUpdate=!0)}return s;function c(e){for(let t=0;t<e.length;t++){let n=e[t],r=new Uint32Array(n),i=new Uint16Array(n);for(let e=0,t=n.byteLength/32;e<t;e++){let t=8*e;Uo(2*t,i)||(r[t+6]=r[t+6]/8-e)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(e,t={}){t.maxLeafTris&&(console.warn(`MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.`),t={...t,targetLeafSize:t.maxLeafTris}),super(e,t)}shiftTriangleOffsets(e){return super.shiftPrimitiveOffsets(e)}writePrimitiveBounds(e,t,n){let r=this.geometry,i=this._indirectBuffer,a=r.attributes.position,o=r.index?r.index.array:null,s=(i?i[e]:e)*3,c=s+0,l=s+1,u=s+2;o&&(c=o[c],l=o[l],u=o[u]);for(let e=0;e<3;e++){let r=a[El[e]](c),i=a[El[e]](l),o=a[El[e]](u),s=r;i<s&&(s=i),o<s&&(s=o);let d=r;i>d&&(d=i),o>d&&(d=o),t[n+e]=s,t[n+e+3]=d}return t}computePrimitiveBounds(e,t,n){let r=this.geometry,i=this._indirectBuffer,a=r.attributes.position,o=r.index?r.index.array:null,s=a.normalized;if(e<0||t+e-n.offset>n.length/6)throw Error(`MeshBVH: compute triangle bounds range is invalid.`);let c=a.array,l=a.offset||0,u=3;a.isInterleavedBufferAttribute&&(u=a.data.stride);let d=[`getX`,`getY`,`getZ`],f=n.offset;for(let r=e,p=e+t;r<p;r++){let e=(i?i[r]:r)*3,t=(r-f)*6,p=e+0,m=e+1,h=e+2;o&&(p=o[p],m=o[m],h=o[h]),s||(p=p*u+l,m=m*u+l,h=h*u+l);for(let e=0;e<3;e++){let r,i,o;s?(r=a[d[e]](p),i=a[d[e]](m),o=a[d[e]](h)):(r=c[p+e],i=c[m+e],o=c[h+e]);let l=r;i<l&&(l=i),o<l&&(l=o);let u=r;i>u&&(u=i),o>u&&(u=o);let f=(u-l)/2,g=e*2;n[t+g+0]=l+f,n[t+g+1]=f+(Math.abs(l)+f)*Po}}return n}raycastObject3D(e,t,n=[]){let{material:r}=e;if(r===void 0)return;wl.copy(e.matrixWorld).invert(),Sl.copy(t.ray).applyMatrix4(wl),Tl.setFromMatrixScale(e.matrixWorld),Cl.copy(Sl.direction).multiply(Tl);let i=Cl.length(),a=t.near/i,o=t.far/i;if(t.firstHitOnly===!0){let i=this.raycastFirst(Sl,r,a,o);i=bl(i,e,t),i&&n.push(i)}else{let i=this.raycast(Sl,r,a,o);for(let r=0,a=i.length;r<a;r++){let a=bl(i[r],e,t);a&&n.push(a)}}return n}refit(e=null){return(this.indirect?Qc:Ec)(this,e)}raycast(e,t=0,n=0,r=1/0){let i=this._roots,a=[],o=this.indirect?$c:jc;for(let s=0,c=i.length;s<c;s++)o(this,s,t,e,a,n,r);return a}raycastFirst(e,t=0,n=0,r=1/0){let i=this._roots,a=null,o=this.indirect?nl:Pc;for(let s=0,c=i.length;s<c;s++){let i=o(this,s,t,e,n,r);i!=null&&(a==null||i.distance<a.distance)&&(a=i)}return a}intersectsGeometry(e,t){let n=!1,r=this._roots,i=this.indirect?ul:Hc;for(let a=0,o=r.length;a<o&&(n=i(this,a,e,t),!n);a++);return n}shapecast(e){let t=rc.getPrimitive(),n=super.shapecast({...e,intersectsPrimitive:e.intersectsTriangle,scratchPrimitive:t,iterate:this.indirect?Ac:Tc});return rc.releasePrimitive(t),n}bvhcast(t,n,r){let{intersectsRanges:i,intersectsTriangles:a}=r,o=rc.getPrimitive(),s=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?e=>{let t=this.resolveTriangleIndex(e);Sc(o,t*3,s,c)}:e=>{Sc(o,e*3,s,c)},u=rc.getPrimitive(),d=t.geometry.index,f=t.geometry.attributes.position,p=t.indirect?e=>{let n=t.resolveTriangleIndex(e);Sc(u,n*3,d,f)}:e=>{Sc(u,e*3,d,f)};if(a){if(!(t instanceof e))throw Error(`MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.`);let r=(e,t,r,i,s,c,d,f)=>{for(let m=r,h=r+i;m<h;m++){p(m),u.a.applyMatrix4(n),u.b.applyMatrix4(n),u.c.applyMatrix4(n),u.needsUpdate=!0;for(let n=e,r=e+t;n<r;n++)if(l(n),o.needsUpdate=!0,a(o,u,n,m,s,c,d,f))return!0}return!1};if(i){let e=i;i=function(t,n,i,a,o,s,c,l){return e(t,n,i,a,o,s,c,l)?!0:r(t,n,i,a,o,s,c,l)}}else i=r}return super.bvhcast(t,n,{intersectsRanges:i})}intersectsBox(e,t){return xl.set(e.min,e.max,t),xl.needsUpdate=!0,this.shapecast({intersectsBounds:e=>xl.intersectsBox(e),intersectsTriangle:e=>xl.intersectsTriangle(e)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,n={},r={},i=0,a=1/0){return(this.indirect?yl:Zc)(this,e,t,n,r,i,a)}closestPointToPoint(e,t={},n=0,r=1/0){return oc(this,e,t,n,r)}},Ol={Mesh:Ne.prototype.raycast,Line:ct.prototype.raycast,LineSegments:ve.prototype.raycast,LineLoop:he.prototype.raycast,Points:Ye.prototype.raycast,BatchedMesh:Ce.prototype.raycast},kl=new Ne,Al=[];function jl(e,t){if(this.isBatchedMesh)Ml.call(this,e,t);else{let{geometry:n}=this;if(n.boundsTree)n.boundsTree.raycastObject3D(this,e,t);else{let n;if(this instanceof Ne)n=Ol.Mesh;else if(this instanceof ve)n=Ol.LineSegments;else if(this instanceof he)n=Ol.LineLoop;else if(this instanceof ct)n=Ol.Line;else if(this instanceof Ye)n=Ol.Points;else throw Error(`BVH: Fallback raycast function not found.`);n.call(this,e,t)}}}function Ml(e,t){if(this.boundsTrees){let n=this.boundsTrees,r=this._drawInfo||this._instanceInfo,i=this._drawRanges||this._geometryInfo,a=this.matrixWorld;kl.material=this.material,kl.geometry=this.geometry;let o=kl.geometry.boundsTree,s=kl.geometry.drawRange;kl.geometry.boundingSphere===null&&(kl.geometry.boundingSphere=new D);for(let o=0,s=r.length;o<s;o++){if(!this.getVisibleAt(o))continue;let s=r[o].geometryIndex;if(kl.geometry.boundsTree=n[s],this.getMatrixAt(o,kl.matrixWorld).premultiply(a),!kl.geometry.boundsTree){this.getBoundingBoxAt(s,kl.geometry.boundingBox),this.getBoundingSphereAt(s,kl.geometry.boundingSphere);let e=i[s];kl.geometry.setDrawRange(e.start,e.count)}kl.raycast(e,Al);for(let e=0,n=Al.length;e<n;e++){let n=Al[e];n.object=this,n.batchId=o,t.push(n)}Al.length=0}kl.geometry.boundsTree=o,kl.geometry.drawRange=s,kl.material=null,kl.geometry=null}else Ol.BatchedMesh.call(this,e,t)}function Nl(e={}){let{type:t=Dl}=e;return this.boundsTree=new t(this,e),this.boundsTree}function Pl(){this.boundsTree=null}var Fl={search_placeholder:`Tìm kiếm cấu trúc giải phẫu (VD: xương đùi, tim, cơ vai)...`,systems:`Hệ Cơ Quan Giải Phẫu`,info:`Thông Tin Chi Tiết`,help:`Hướng Dẫn Điều Khiển`,language_it:`IT`,language_en:`EN`,language_vi:`VI`,reset:`Đặt lại`,isolate:`Cô lập`,hide:`Ẩn`,transparent:`Bóng mờ`,show_all:`Hiện tất cả`,front_view:`Trước`,side_view:`Nghiêng`,back_view:`Sau`,top_view:`Trên`,loading_model:`Đang khởi tạo mô hình 3D...`,loading_system:`Đang tải hệ: {system}`,select_structure:`Chọn một cấu trúc giải phẫu`,click_to_select:`Chạm vào mô hình 3D để xem thông tin chi tiết`,no_data_available:`Không có thông tin cho cấu trúc này`,structure_not_found:`Không tìm thấy cấu trúc`,error_loading_model:`Lỗi khi tải mô hình 3D`,error_loading_data:`Lỗi khi tải dữ liệu`,system_muscular:`Hệ Cơ bắp`,system_skeletal:`Hệ Xương`,system_cardiovascular:`Hệ Tim mạch`,system_respiratory:`Hệ Hô hấp`,system_digestive:`Hệ Tiêu hóa`,system_urinary:`Hệ Tiết niệu`,system_nervous:`Hệ Thần kinh & Giác quan`,system_joints:`Khớp & Dây chằng`,system_lymphatic:`Hệ Bạch huyết`,system_visceral:`Hệ Nội tạng`,name:`Tên gọi`,latin_name:`Tên Latinh`,system:`Hệ cơ quan`,region:`Vùng cơ thể`,description:`Mô tả giải phẫu`,functions:`Chức năng`,origin:`Nguyên ủy`,insertion:`Bám tận`,innervation:`Phân bố thần kinh`,vascularization:`Mạch máu nuôi`,clinical_notes:`Ý nghĩa lâm sàng`,parts:`Các phần`,help_title:`Thao Tác Điều Khiển`,help_computer:`Máy tính (Chuột)`,help_mobile:`Điện thoại (Cảm ứng)`,help_controls:`Điều khiển`,help_drag_left:`Kéo chuột trái`,help_rotate:`Xoay 360°`,help_wheel:`Lăn chuột`,help_zoom:`Phóng to / Thu nhỏ`,help_drag_right:`Kéo chuột phải`,help_pan:`Di chuyển góc nhìn`,help_double_click:`Nhấp đúp`,help_approach:`Tiến lại gần cấu trúc`,help_one_finger:`1 ngón tay`,help_pinch:`2 ngón chụm/mở`,help_two_fingers:`2 ngón kéo`,help_tap:`Chạm nhẹ`,view_front:`Nhìn phía trước`,view_back:`Nhìn phía sau`,view_left:`Nhìn bên trái`,view_right:`Nhìn bên phải`,view_top:`Nhìn từ trên`,view_bottom:`Nhìn từ dưới`,view_full:`Toàn cảnh`,action_isolate:`Cô lập`,action_hide:`Bóc tách / Ẩn`,action_transparent:`Bóng mờ`,action_restore:`Phục hồi tất cả`,action_search:`Tìm kiếm`,loading_systems:`Đang nạp hệ cơ quan...`,loading_structure:`Đang nạp cấu trúc...`,error:`Lỗi`,close:`Đóng`,region_head:`Đầu`,region_neck:`Cổ`,region_thorax:`Ngực`,region_abdomen:`Bụng`,region_upper_limb:`Chi trên (Tay)`,region_lower_limb:`Chi dưới (Chân)`,no_results:`Không tìm thấy kết quả phù hợp`,retry:`Thử lại`,depth:`Độ sâu bóc tách`,side_left_short:`Trái`,side_right_short:`Phải`,side_left:`Bên trái`,side_right:`Bên phải`,help_touch:`Thao tác chạm`,help_panels:`Bảng điều khiển`,help_credits:`Bản quyền & Nguồn dữ liệu`,help_frame:`Căn giữa cấu trúc`,help_select:`Chọn cấu trúc`,help_left_drag:`Kéo ngón tay`,help_right_drag:`Kéo 2 ngón`,help_two_finger:`Kéo 2 ngón`,help_left_panel:`Bảng trái: Bật/tắt các hệ giải phẫu`,help_right_panel:`Bảng phải: Chi tiết và kiến thức y khoa`,help_bottom_bar:`Thanh dưới: Bóc tách, cô lập, bóng mờ`,help_toolbar:`Góc nhìn đặt sẵn`,controls_title:`Thao Tác Điều Khiển`,loading_definition:`Đang tải định nghĩa giải phẫu...`,no_definition:`Chưa có mô tả chi tiết cho cấu trúc này.`,read_more:`Tìm hiểu thêm trên Wikipedia`,non_official:`Thuật ngữ phụ`,non_official_hint:`Thuật ngữ không chính thức trong TA2`,part_of:`Thuộc về`,contains:`Bao gồm`,opaque:`Đậm rõ`,dissect:`Bóc tách`,undo:`Hoàn tác`},Il={search_placeholder:`Cerca una struttura anatomica...`,systems:`Sistemi Anatomici`,info:`Informazioni`,help:`Aiuto`,language_it:`IT`,language_en:`EN`,reset:`Reset`,isolate:`Isola`,hide:`Nascondi`,transparent:`Trasparenza`,show_all:`Mostra tutto`,front_view:`Anteriore`,side_view:`Laterale`,back_view:`Posteriore`,top_view:`Superiore`,loading_model:`Caricamento modello 3D...`,loading_system:`Caricamento sistema: {system}`,select_structure:`Seleziona una struttura anatomica`,click_to_select:`Clicca sul modello 3D per visualizzare le informazioni`,no_data_available:`Nessuna informazione disponibile per questa struttura`,structure_not_found:`Struttura non trovata`,error_loading_model:`Errore nel caricamento del modello`,error_loading_data:`Errore nel caricamento dei dati`,system_muscular:`Sistema muscolare`,system_skeletal:`Sistema scheletrico`,system_cardiovascular:`Sistema cardiovascolare`,system_respiratory:`Sistema respiratorio`,system_digestive:`Sistema digerente`,system_urinary:`Sistema urinario`,system_nervous:`Sistema nervoso e organi di senso`,system_joints:`Articolazioni`,system_lymphatic:`Organi linfatici`,name:`Nome`,latin_name:`Nome latino`,system:`Sistema`,region:`Regione`,description:`Descrizione`,functions:`Funzioni`,origin:`Origine`,insertion:`Inserzione`,innervation:`Innervazione`,vascularization:`Vascolarizzazione`,clinical_notes:`Note cliniche`,parts:`Parti`,help_title:`Comandi`,help_computer:`Computer`,help_mobile:`Smartphone`,help_controls:`Controlli`,help_drag_left:`Trascina sinistro`,help_rotate:`Ruota`,help_wheel:`Rotellina`,help_zoom:`Zoom`,help_drag_right:`Trascina destro`,help_pan:`Sposta`,help_double_click:`Doppio clic`,help_approach:`Avvicina struttura`,help_one_finger:`Un dito`,help_pinch:`Pizzica`,help_two_fingers:`Trascina 2 dita`,help_tap:`Tocco`,view_front:`Vista anteriore`,view_back:`Vista posteriore`,view_left:`Vista sinistra`,view_right:`Vista destra`,view_top:`Vista superiore`,view_bottom:`Vista inferiore`,view_full:`Vista completa`,action_isolate:`Isola`,action_hide:`Nascondi`,action_transparent:`Rendi trasparente`,action_restore:`Ripristina tutto`,action_search:`Cerca`,loading_systems:`Caricamento sistemi...`,loading_structure:`Caricamento struttura...`,error:`Errore`,close:`Chiudi`,region_head:`Capo`,region_neck:`Collo`,region_thorax:`Torace`,region_abdomen:`Addome`,region_upper_limb:`Arto superiore`,region_lower_limb:`Arto inferiore`,no_results:`Nessun risultato`,retry:`Riprova`,depth:`Profondità`,side_left_short:`S`,side_right_short:`D`,side_left:`Sinistro`,side_right:`Destro`,help_touch:`Touch`,help_panels:`Pannelli`,help_credits:`Crediti e licenze`,help_frame:`Inquadra struttura`,help_select:`Seleziona`,help_left_drag:`Trascina sinistro`,help_right_drag:`Trascina destro`,help_two_finger:`Trascina 2 dita`,help_left_panel:`Pannello sinistro: sistemi anatomici`,help_right_panel:`Pannello destro: dettagli struttura`,help_bottom_bar:`Barra inferiore: azioni sulla selezione`,help_toolbar:`Barra comandi: viste predefinite`,controls_title:`Comandi`,loading_definition:`Caricamento definizione...`,no_definition:`Nessuna definizione disponibile per questa struttura.`,read_more:`Approfondisci su Wikipedia`,non_official:`non ufficiale`,non_official_hint:`Termine non incluso nella Terminologia Anatomica`,system_visceral:`Sistemi viscerali`,part_of:`Parte di`,contains:`Contiene`,opaque:`Opaco`},Ll={search_placeholder:`Search anatomical structure...`,systems:`Anatomical Systems`,info:`Information`,help:`Help`,language_it:`IT`,language_en:`EN`,reset:`Reset`,isolate:`Isolate`,hide:`Hide`,transparent:`Transparency`,show_all:`Show all`,front_view:`Front`,side_view:`Side`,back_view:`Back`,top_view:`Top`,loading_model:`Loading 3D model...`,loading_system:`Loading system: {system}`,select_structure:`Select an anatomical structure`,click_to_select:`Click on 3D model to view information`,no_data_available:`No information available for this structure`,structure_not_found:`Structure not found`,error_loading_model:`Error loading model`,error_loading_data:`Error loading data`,system_muscular:`Muscular system`,system_skeletal:`Skeletal system`,system_cardiovascular:`Cardiovascular system`,system_respiratory:`Respiratory system`,system_digestive:`Digestive system`,system_urinary:`Urinary system`,system_nervous:`Nervous system & sense organs`,system_joints:`Joints`,system_lymphatic:`Lymphoid organs`,name:`Name`,latin_name:`Latin name`,system:`System`,region:`Region`,description:`Description`,functions:`Functions`,origin:`Origin`,insertion:`Insertion`,innervation:`Innervation`,vascularization:`Vascularization`,clinical_notes:`Clinical notes`,parts:`Parts`,help_title:`Controls`,help_computer:`Computer`,help_mobile:`Smartphone`,help_controls:`Controls`,help_drag_left:`Drag left`,help_rotate:`Rotate`,help_wheel:`Wheel`,help_zoom:`Zoom`,help_drag_right:`Drag right`,help_pan:`Pan`,help_double_click:`Double click`,help_approach:`Approach structure`,help_one_finger:`One finger`,help_pinch:`Pinch`,help_two_fingers:`Drag 2 fingers`,help_tap:`Tap`,view_front:`Front view`,view_back:`Back view`,view_left:`Left view`,view_right:`Right view`,view_top:`Top view`,view_bottom:`Bottom view`,view_full:`Full view`,action_isolate:`Isolate`,action_hide:`Hide`,action_transparent:`Make transparent`,action_restore:`Restore all`,action_search:`Search`,loading_systems:`Loading systems...`,loading_structure:`Loading structure...`,error:`Error`,close:`Close`,region_head:`Head`,region_neck:`Neck`,region_thorax:`Thorax`,region_abdomen:`Abdomen`,region_upper_limb:`Upper limb`,region_lower_limb:`Lower limb`,no_results:`No results`,retry:`Retry`,depth:`Depth`,side_left_short:`L`,side_right_short:`R`,side_left:`Left`,side_right:`Right`,help_touch:`Touch`,help_panels:`Panels`,help_credits:`Credits and licences`,help_frame:`Frame structure`,help_select:`Select`,help_left_drag:`Left drag`,help_right_drag:`Right drag`,help_two_finger:`Two-finger drag`,help_left_panel:`Left panel: anatomical systems`,help_right_panel:`Right panel: structure details`,help_bottom_bar:`Bottom bar: actions on the selection`,help_toolbar:`Toolbar: preset views`,controls_title:`Controls`,loading_definition:`Loading definition...`,no_definition:`No definition available for this structure.`,read_more:`Read more on Wikipedia`,non_official:`non-official`,non_official_hint:`Term not in Terminologia Anatomica`,system_visceral:`Visceral systems`,part_of:`Part of`,contains:`Contains`,opaque:`Opaque`},Y={selectedPart:null,loadedSystems:[],partStates:new Map,isolatedPart:null,hiddenParts:new Set,transparentParts:new Set,language:`vi`,dissectMode:!1,undoStack:[],partsData:null,systemsData:null,regionsData:null,translations:{vi:Fl,en:Ll,it:Il},searchIndex:[],currentView:`front`,isAnimating:!1,loading:{systems:{},progress:0,total:0},viewer:null,selectionHistory:[],maxHistory:20},Rl=new Map;function zl(e,t){return Rl.has(e)||Rl.set(e,new Set),Rl.get(e).add(t),()=>Bl(e,t)}function Bl(e,t){Rl.has(e)&&Rl.get(e).delete(t)}function X(e,t){Rl.has(e)&&Rl.get(e).forEach(e=>e(t)),Y.viewer?.render?.()}function Vl(e){Y.selectedPart=e,e&&(Y.selectionHistory.unshift(e),Y.selectionHistory.length>Y.maxHistory&&Y.selectionHistory.pop()),X(`selectedPart`,e)}var Hl=0;function Ul(e,t){let n=Y.partStates.get(e)||{visible:!0,opacity:1,selected:!1};Y.partStates.set(e,{...n,...t}),Hl===0&&X(`partStates`,Y.partStates)}function Wl(e){Hl++;try{e()}finally{Hl--,Hl===0&&X(`partStates`,Y.partStates)}}function Gl(e){Y.isolatedPart=e,X(`isolatedPart`,e)}function Kl(e){Y.hiddenParts=new Set(e),X(`hiddenParts`,Y.hiddenParts)}function ql(e){Y.transparentParts=new Set(e),X(`transparentParts`,Y.transparentParts)}function Jl(e){Y.language=e,X(`language`,e)}function Yl(e){Y.partsData=e,X(`partsData`,e)}function Xl(e){Y.systemsData=e,X(`systemsData`,e)}function Zl(e){Y.translations={vi:{...Fl,...e.vi||{}},en:{...Ll,...e.en||{}},it:{...Il,...e.it||{}}},X(`translations`,Y.translations)}function Ql(e){Y.searchIndex=e,X(`searchIndex`,e)}function $l(e){Y.currentView=e,X(`currentView`,e)}function eu(e){Y.isAnimating=e,X(`isAnimating`,e)}function tu(e,t,n=100,r={}){Y.loading.systems[e]={loaded:t,progress:n,...r};let i=Object.values(Y.loading.systems).filter(e=>e.loaded).length,a=Object.keys(Y.loading.systems).length;Y.loading.progress=a>0?i/a*100:0,Y.loading.total=a,X(`loading`,{...Y.loading,system:e,...Y.loading.systems[e]})}function nu(e){Y.viewer=e}function ru(e){let t=Y.partStates.get(e);return t||(t={visible:!0,opacity:1,selected:!1},Y.partStates.set(e,t)),t}function iu(e){return Y.partsData&&Y.partsData[e]||null}function Z(e,t=Y.language){return(Y.translations[t]||Y.translations.vi||Y.translations.en||Y.translations.it||{})[e]||e}function au(e){Y.undoStack.push(e),X(`undoStack`,Y.undoStack)}function ou(){let e=Y.undoStack.pop();return X(`undoStack`,Y.undoStack),e}function su(e){return Y.systemsData&&Y.systemsData[e]||[]}var cu=`/3d/`;function lu(e){return`${cu}${e.replace(/^\//,``)}`}_t.prototype.computeBoundsTree=Nl,_t.prototype.disposeBoundsTree=Pl,Ne.prototype.raycast=jl;var uu=new Ao;uu.setDecoderPath(lu(`draco/`)),uu.preload();var du=new Map,fu=new Map,pu=new Map,mu=new Map,hu=new Te;function gu(){return du}function _u(e){return fu.get(e)}function vu(){return Array.from(mu.values())}function yu(e){let t=fu.get(e);return t?t.ownMeshes:[]}function bu(e){let t=[],n=e=>{let r=fu.get(e);r&&(t.push(e),r.childIds.forEach(n))};return n(e),t}var xu=new Map;function Su(e,t,n={}){if(Y.loadedSystems.includes(e))return Promise.resolve({systemId:e,model:mu.get(e),meshCount:pu.get(e)?.length||0});let r=xu.get(e);if(r)return r;let i=Cu(e,t,n).finally(()=>xu.delete(e));return xu.set(e,i),i}async function Cu(e,t,n={}){let{scene:r,renderer:i,camera:a}=t;console.log(`[loadModel] Starting load of ${e}.glb`);let o=(await new Promise((t,n)=>{let r=new Ea(hu);r.setDRACOLoader(uu);let i=lu(`models/${e}.glb`);tu(e,!1,0),r.load(i,t,t=>{tu(e,!1,t.lengthComputable?t.loaded/t.total*100:0,{loaded:t.loaded,total:t.lengthComputable?t.total:0})},t=>{console.error(`[loadModel] Error loading ${e}:`,t),tu(e,!0,100,{failed:!0}),n(t)})})).scene;if(wu(o,e,t),i?.compileAsync)try{await i.compileAsync(o,a,r)}catch{}return r.add(o),mu.set(e,o),Y.loadedSystems.push(e),tu(e,!0,100),{systemId:e,model:o,meshCount:pu.get(e)?.length||0}}function wu(e,t,n){let r=[];e.traverse(e=>{let n=e.userData?.za_name;if(!n)return;e.userData.partId=n,e.userData.system=t,e.userData.originalName=n;let i=Tu(e.parent);if(r.push(e),du.set(n,e),fu.set(n,{node:e,systemId:t,parentId:i,childIds:[],ownMeshes:[]}),i){let e=fu.get(i);e&&e.childIds.push(n)}}),e.updateMatrixWorld(!0),r.forEach(t=>{fu.get(t.userData.partId).parentId&&e.attach(t)}),e.traverse(e=>{if(!e.isMesh)return;Eu(e,t,n);let r=Tu(e),i=r&&fu.get(r);i&&i.ownMeshes.push(e)}),pu.set(t,r),console.log(`Loaded ${t}: ${r.length} structures`)}function Tu(e){let t=e;for(;t;){if(t.userData?.partId)return t.userData.partId;t=t.parent}return null}function Eu(e,t,n){e.userData.baseMaterial||(e.material&&(e.userData.baseMaterial=e.material),e.geometry&&!e.geometry.boundsTree&&e.geometry.computeBoundsTree(),e.castShadow=!1,e.receiveShadow=!1,e.frustumCulled=!0,e.material&&(Array.isArray(e.material)?e.material.some(e=>e.transparent):e.material.transparent)&&(e.renderOrder=1))}async function Du(e,t,n={}){let{sequential:r=!1}=n;if(r)for(let n of e)try{await Su(n,t)}catch(e){console.error(`Failed to load ${n}:`,e)}else{let n=[...e];await Promise.all(Array.from({length:Math.min(2,n.length)},async()=>{for(;n.length;){let e=n.shift();try{await Su(e,t)}catch(t){console.error(`Failed to load ${e}:`,t)}}}))}return Ou(t),du}function Ou(e){let{scene:t,camera:n,controls:r}=e,i=new ft,a=!1;if(t.traverse(e=>{e.isMesh&&e.visible&&(i.expandByObject(e),a=!0)}),!a||i.isEmpty())return;let o=i.getCenter(new U),s=i.getSize(new U),c=Math.max(s.x,s.y,s.z)*1.5,l=new U(0,0,1).applyQuaternion(n.quaternion);n.position.copy(o).add(l.multiplyScalar(c)),r.target.copy(o),r.update(),n.userData.initialPosition=n.position.clone(),n.userData.initialTarget=r.target.clone(),n.userData.initialZoom=r.zoom}function ku(e){return pu.get(e)||[]}function Au(e){let t=mu.get(e);if(!t)return!1;t.removeFromParent();let n=new Set;return t.traverse(e=>{e.isMesh&&(e.geometry?.disposeBoundsTree?.(),e.geometry?.dispose(),[e.material,e.userData.baseMaterial].flatMap(e=>Array.isArray(e)?e:[e]).filter(Boolean).forEach(e=>{n.has(e)||(n.add(e),e.dispose())}))}),fu.forEach((t,n)=>{t.systemId===e&&(fu.delete(n),du.delete(n),Y.partStates.delete(n))}),pu.delete(e),mu.delete(e),Y.loadedSystems=Y.loadedSystems.filter(t=>t!==e),!0}function ju(e){return Array.isArray(e.material)?e.material:[e.material]}function Mu(e){return e.userData.ownsMaterial||(e.material=Array.isArray(e.material)?e.material.map(e=>e.clone()):e.material.clone(),e.userData.ownsMaterial=!0),ju(e)}function Nu(e,t){let n=e.userData.baseMaterial;return n?Xu?.has(t)?Array.isArray(n)?n.map(Iu):Iu(n):n:null}function Pu(e,t){e.userData.ownsMaterial&&(ju(e).forEach(e=>e.dispose()),e.userData.ownsMaterial=!1);let n=Nu(e,t);n&&(e.material=n)}var Fu=new WeakMap;function Iu(e){let t=Fu.get(e);return t||(t=e.clone(),t.transparent=!0,t.opacity=Yu,t.depthWrite=!1,Fu.set(e,t)),t}function Lu(e,t){yu(e).forEach(e=>{e.visible=t});let n=ru(e);n.visible=t,Ul(e,{visible:t}),t?Y.hiddenParts.delete(e):Y.hiddenParts.add(e)}function Ru(e){gu().has(e)&&(Wl(()=>{bu(e).forEach(e=>Lu(e,!1))}),X(`partHidden`,e))}function zu(e){gu().has(e)&&(Wl(()=>{bu(e).forEach(e=>{Lu(e,!0),Ju(e),Ul(e,{opacity:1}),Y.transparentParts.delete(e)})}),X(`partShown`,e))}function Bu(e,t){yu(e).forEach(e=>{t>=1&&!e.userData.ownsMaterial||Mu(e).forEach(e=>{e.transparent=t<1,e.opacity=t,e.depthWrite=t>=1,e.needsUpdate=!0})});let n=ru(e);n.opacity=t,Ul(e,{opacity:t}),t<1?Y.transparentParts.add(e):Y.transparentParts.delete(e)}function Vu(e,t){gu().has(e)&&(t=je.clamp(t,0,1),Bu(e,t),X(`partTransparencyChanged`,{partId:e,opacity:t}))}function Hu(e){if(!gu().has(e))return;let t=new Set(bu(e));Wl(()=>{gu().forEach((e,n)=>{let r=t.has(n);if(Lu(n,r),!r)return;Ju(n);let i=ru(n)?.opacity??1;i<1&&Bu(n,i)})}),Gl(e),X(`partIsolated`,e)}function Uu(){Wl(()=>{gu().forEach((e,t)=>{Lu(t,!0),Ju(t);let n=ru(t);n.opacity=1,n.selected=!1,Ul(t,{opacity:1,selected:!1})})}),Y.hiddenParts.clear(),Y.transparentParts.clear(),Gl(null),Kl([]),ql([]),X(`allPartsRestored`,!0)}function Wu(e){Wl(()=>{ku(e).forEach(e=>{let t=e.userData.partId;t&&Lu(t,!1)})}),X(`systemHidden`,e)}function Gu(e){Wl(()=>{ku(e).forEach(e=>{let t=e.userData.partId;t&&(Lu(t,!0),Ju(t),Ul(t,{opacity:1}),Y.transparentParts.delete(t))})}),X(`systemShown`,e)}function Ku(e,t){t=je.clamp(t,0,1),Wl(()=>{ku(e).forEach(e=>{let n=e.userData.partId;n&&Bu(n,t)})}),X(`systemTransparencyChanged`,{systemId:e,opacity:t})}function qu(e){let t=ku(e);if(t.length===0)return{visible:!1,total:0,visibleCount:0};let n=t.filter(e=>{let t=e.userData.partId;return t&&yu(t).some(e=>e.visible)}).length;return{visible:n>0,total:t.length,visibleCount:n}}function Ju(e){Xu?.delete(e),yu(e).forEach(t=>Pu(t,e))}var Yu=.12,Xu=null;function Zu(e){let t=new Set(bu(e)),n=new Set;gu().forEach((e,r)=>{t.has(r)||yu(r).some(e=>e.visible)&&n.add(r)}),Xu=n,n.forEach(e=>{yu(e).forEach(t=>Pu(t,e))}),t.forEach(e=>Ju(e)),X(`ghostModeChanged`,e)}function Qu(){if(!Xu)return;let e=[...Xu];Xu=null,e.forEach(e=>{Ju(e);let t=ru(e)?.opacity??1;t<1&&Vu(e,t)}),X(`ghostModeChanged`,null)}function $u(e,t=16768861,n=.5){yu(e).forEach(e=>{Mu(e).forEach(e=>{e.emissive=new H(t),e.emissiveIntensity=n,e.needsUpdate=!0})})}function ed(e){yu(e).forEach(t=>{t.userData.ownsMaterial&&((ru(e)?.opacity??1)<1?ju(t).forEach(e=>{let n=t.userData.baseMaterial,r=Array.isArray(n)?n[0]:n;r?.emissive&&e.emissive.copy(r.emissive),e.emissiveIntensity=r?.emissiveIntensity??1,e.needsUpdate=!0}):Pu(t,e))})}var td={front:{position:new U(0,0,1),target:new U(0,0,0)},back:{position:new U(0,0,-1),target:new U(0,0,0)},left:{position:new U(-1,0,0),target:new U(0,0,0)},right:{position:new U(1,0,0),target:new U(0,0,0)},top:{position:new U(0,1,0),target:new U(0,0,0)},bottom:{position:new U(0,-1,0),target:new U(0,0,0)},full:{position:new U(0,0,1),target:new U(0,0,0)}},nd=500;function rd(e,t,n=!0){let r=td[e];if(!r)return Promise.resolve();let{camera:i,controls:a}=t,o=id(t.scene);if(!o)return Promise.resolve();let s=o.maxDim*1.5,c=o.center.clone(),l=r.position.clone().multiplyScalar(s).add(c);return n?ad(i,a,l,c):(i.position.copy(l),a.target.copy(c),a.update(),$l(e),Promise.resolve())}function id(e){let t=new ft,n=!1;if(e.traverse(e=>{e.isMesh&&e.visible&&(t.expandByObject(e),n=!0)}),!n||t.isEmpty())return null;let r=t.getSize(new U);return{box:t,size:r,center:t.getCenter(new U),maxDim:Math.max(r.x,r.y,r.z)}}function ad(e,t,n,r){return window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches?(e.position.copy(n),t.target.copy(r),t.update(),Promise.resolve()):new Promise(i=>{eu(!0);let a=e.position.clone(),o=t.target.clone(),s=performance.now();function c(l){let u=l-s,d=Math.min(u/nd,1),f=1-(1-d)**3;e.position.lerpVectors(a,n,f),t.target.lerpVectors(o,r,f),t.update(),d<1?requestAnimationFrame(c):(eu(!1),i())}requestAnimationFrame(c)})}function od(e,t,n=!0,r=2.5){let{camera:i,controls:a}=t,o=new ft().setFromObject(e),s=o.getCenter(new U),c=o.getSize(new U),l=Math.max(c.x,c.y,c.z),u=i.position.distanceTo(a.target),d=Math.min(Math.max(l*r,l*1.2),u),f=new U().subVectors(i.position,a.target).normalize(),p=s.clone().add(f.multiplyScalar(d));return n?ad(i,a,p,s):(i.position.copy(p),a.target.copy(s),a.update(),Promise.resolve())}function sd(e,t=!0){return rd(`front`,e,t).then(()=>{cd(),X(`viewReset`,!0)})}function cd(){Uu()}function ld(e,t){if(!t||!e)return Promise.resolve();let{camera:n,controls:r}=t;return ad(n,r,new U(e.x,e.y,e.z),new U(e.targetX,e.targetY,e.targetZ))}var ud=96,dd=-64,fd=12,pd=null,md=null,hd=null,gd=null,_d=new U,vd=new U,yd=null,bd={};function xd(e){pd=document.createElement(`div`),pd.className=`callout-layer`,pd.innerHTML=`
    <svg class="callout-line" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0" /></svg>
    <div class="callout" role="status">
      <span class="callout-name"></span>
      <div class="callout-actions">
        <button type="button" class="callout-btn" data-callout="isolate"></button>
        <button type="button" class="callout-btn" data-callout="hide"></button>
        <button type="button" class="callout-btn callout-close" data-callout="close" aria-label="Chiudi">&times;</button>
      </div>
    </div>
  `,e.appendChild(pd),md=pd.querySelector(`.callout`),hd=pd.querySelector(`.callout-line line`),pd.addEventListener(`click`,e=>{let t=e.target.closest(`[data-callout]`)?.dataset.callout;t&&(e.stopPropagation(),bd[t]?.(yd))})}function Sd(e){let t=yu(e);if(!t.length){let t=_u(e)?.node;t&&t.getWorldPosition(_d);return}let n=new ft;t.forEach(e=>n.expandByObject(e)),n.getCenter(_d)}function Cd(){if(!yd||!Y.viewer)return;let{camera:e,canvas:t}=Y.viewer;vd.copy(_d).project(e);let n=t.clientWidth,r=t.clientHeight,i=(vd.x*.5+.5)*n,a=(-vd.y*.5+.5)*r,o=vd.z>1;if(pd.classList.toggle(`is-hidden`,o),o)return;let s=md.getBoundingClientRect(),c=i+ud,l=a+dd;c=Math.min(Math.max(c,fd),n-s.width-fd),l=Math.min(Math.max(l,fd),r-s.height-fd),md.style.transform=`translate(${Math.round(c)}px, ${Math.round(l)}px)`;let u=c>i?c:c+s.width;hd.setAttribute(`x1`,i),hd.setAttribute(`y1`,a),hd.setAttribute(`x2`,u),hd.setAttribute(`y2`,l+s.height/2)}function wd(e,t,n={}){let r=document.getElementById(`viewerContainer`);if(!r)return;pd||xd(r),bd=n,yd=e;let i=Y.partsData?.[e],a=pd.querySelector(`.callout-name`);a.textContent=t,a.title=i?.latinName?`${t} — ${i.latinName}`:t,pd.querySelector(`[data-callout="isolate"]`).textContent=Z(`isolate`),pd.querySelector(`[data-callout="hide"]`).textContent=Z(`hide`),Sd(e),pd.classList.remove(`is-hidden`),pd.classList.add(`is-visible`),Cd(),!gd&&Y.viewer?.onFrame&&(gd=Y.viewer.onFrame(Cd))}function Td(){yd=null,pd&&pd.classList.remove(`is-visible`),gd&&=(gd(),null)}var Ed={"Frontal bone":`Xương trán`,"Parietal bone":`Xương đỉnh`,"Occipital bone":`Xương chẩm`,"Temporal bone":`Xương thái dương`,"Sphenoid bone":`Xương bướm`,"Ethmoid bone":`Xương sàng`,Mandible:`Xương hàm dưới`,Maxilla:`Xương hàm trên`,"Zygomatic bone":`Xương gò má`,"Nasal bone":`Xương mũi`,"Lacrimal bone":`Xương lệ`,"Palatine bone":`Xương khẩu cái`,Vomer:`Xương lá mía`,"Inferior nasal concha":`Xương xoăn mũi dưới`,"Hyoid bone":`Xương móng`,"Anterior cells of ethmoid bone":`Các xoang sàng trước`,"Middle cells of ethmoid bone":`Các xoang sàng giữa`,"Posterior cells of ethmoid bone":`Các xoang sàng sau`,"Arytenoid cartilage":`Sụn phễu`,"Thyroid cartilage":`Sụn giáp`,"Cricoid cartilage":`Sụn nhẫn`,Epiglottis:`Nắp thanh môn`,"Corniculate cartilage":`Sụn sừng`,"Cuneiform cartilage":`Sụn chêm`,"Atlas (C1)":`Đốt sống cổ C1 (Đốt đội)`,"Axis (C2)":`Đốt sống cổ C2 (Đốt trục)`,"Third cervical vertebra (C3)":`Đốt sống cổ C3`,"Fourth cervical vertebra (C4)":`Đốt sống cổ C4`,"Fifth cervical vertebra (C5)":`Đốt sống cổ C5`,"Sixth cervical vertebra (C6)":`Đốt sống cổ C6`,"Seventh cervical vertebra (C7)":`Đốt sống cổ C7`,"First thoracic vertebra (T1)":`Đốt sống ngực T1`,"Second thoracic vertebra (T2)":`Đốt sống ngực T2`,"Third thoracic vertebra (T3)":`Đốt sống ngực T3`,"Fourth thoracic vertebra (T4)":`Đốt sống ngực T4`,"Fifth thoracic vertebra (T5)":`Đốt sống ngực T5`,"Sixth thoracic vertebra (T6)":`Đốt sống ngực T6`,"Seventh thoracic vertebra (T7)":`Đốt sống ngực T7`,"Eighth thoracic vertebra (T8)":`Đốt sống ngực T8`,"Ninth thoracic vertebra (T9)":`Đốt sống ngực T9`,"Tenth thoracic vertebra (T10)":`Đốt sống ngực T10`,"Eleventh thoracic vertebra (T11)":`Đốt sống ngực T11`,"Twelfth thoracic vertebra (T12)":`Đốt sống ngực T12`,"First lumbar vertebra (L1)":`Đốt sống thắt lưng L1`,"Second lumbar vertebra (L2)":`Đốt sống thắt lưng L2`,"Third lumbar vertebra (L3)":`Đốt sống thắt lưng L3`,"Fourth lumbar vertebra (L4)":`Đốt sống thắt lưng L4`,"Fifth lumbar vertebra (L5)":`Đốt sống thắt lưng L5`,Sacrum:`Xương cùng`,Coccyx:`Xương cụt`,Sternum:`Xương ức`,"Body of sternum":`Thân xương ức`,"Manubrium of sternum":`Cán xương ức`,"Xiphoid process":`Mỏm mũi kiếm (xương ức)`,"First rib":`Xương sườn 1`,"Second rib":`Xương sườn 2`,"Third rib":`Xương sườn 3`,"Fourth rib":`Xương sườn 4`,"Fifth rib":`Xương sườn 5`,"Sixth rib":`Xương sườn 6`,"Seventh rib":`Xương sườn 7`,"Eighth rib":`Xương sườn 8`,"Ninth rib":`Xương sườn 9`,"Tenth rib":`Xương sườn 10`,"Eleventh rib":`Xương sườn 11`,"Twelfth rib":`Xương sườn 12`,"Costal cartilage of first rib":`Sụn sườn 1`,"Costal cartilage of second rib":`Sụn sườn 2`,"Costal cartilage of third rib":`Sụn sườn 3`,"Costal cartilage of fourth rib":`Sụn sườn 4`,"Costal cartilage of fifth rib":`Sụn sườn 5`,"Costal cartilage of sixth rib":`Sụn sườn 6`,"Costal cartilage of seventh rib":`Sụn sườn 7`,"Costal cartilage of eighth rib":`Sụn sườn 8`,"Costal cartilage of ninth rib":`Sụn sườn 9`,"Costal cartilage of tenth rib":`Sụn sườn 10`,Clavicle:`Xương đòn (Quai xanh)`,Scapula:`Xương bả vai`,Humerus:`Xương cánh tay`,Radius:`Xương quay`,Ulna:`Xương trụ`,"Scaphoid bone":`Xương thuyền`,"Lunate bone":`Xương nguyệt`,Triquetrum:`Xương tháp`,"Pisiform bone":`Xương đậu`,"Trapezium bone":`Xương thang`,"Trapezoid bone":`Xương thê`,"Capitate bone":`Xương cả`,"Hamate bone":`Xương móc`,"First metacarpal bone":`Xương đốt bàn tay 1 (ngón cái)`,"Second metacarpal bone":`Xương đốt bàn tay 2`,"Third metacarpal bone":`Xương đốt bàn tay 3`,"Fourth metacarpal bone":`Xương đốt bàn tay 4`,"Fifth metacarpal bone":`Xương đốt bàn tay 5`,"Hip bone":`Xương chậu`,Pelvis:`Khung chậu`,Femur:`Xương đùi`,Patella:`Xương bánh chè`,Tibia:`Xương chày`,Fibula:`Xương mác`,Talus:`Xương sên`,Calcaneus:`Xương gót`,"Navicular bone":`Xương ghe`,"Medial cuneiform bone":`Xương chêm trong`,"Intermediate cuneiform bone":`Xương chêm giữa`,"Lateral cuneiform bone":`Xương chêm ngoài`,"Cuboid bone":`Xương hộp`,"First metatarsal bone":`Xương đốt bàn chân 1`,"Second metatarsal bone":`Xương đốt bàn chân 2`,"Third metatarsal bone":`Xương đốt bàn chân 3`,"Fourth metatarsal bone":`Xương đốt bàn chân 4`,"Fifth metatarsal bone":`Xương đốt bàn chân 5`,"Deltoid muscle":`Cơ delta (cơ vai)`,"Pectoralis major":`Cơ ngực lớn`,"Pectoralis minor":`Cơ ngực bé`,"Biceps brachii":`Cơ nhị đầu cánh tay (chuột trước)`,"Triceps brachii":`Cơ tam đầu cánh tay (bắp sau)`,Brachialis:`Cơ cánh tay`,Brachioradialis:`Cơ cánh tay quay`,Trapezius:`Cơ thang (vai - gáy)`,"Latissimus dorsi":`Cơ lưng rộng (cơ xô)`,"Rectus abdominis":`Cơ thẳng bụng (cơ 6 múi)`,"External oblique":`Cơ chéo bụng ngoài`,"Internal oblique":`Cơ chéo bụng trong`,"Transversus abdominis":`Cơ ngang bụng`,"Gluteus maximus":`Cơ mông lớn`,"Gluteus medius":`Cơ mông nhỡ`,"Gluteus minimus":`Cơ mông bé`,Piriformis:`Cơ hình lê`,"Quadriceps femoris":`Cơ tứ đầu đùi`,"Rectus femoris":`Cơ thẳng đùi`,"Vastus lateralis":`Cơ rộng ngoài`,"Vastus medialis":`Cơ rộng trong`,"Vastus intermedius":`Cơ rộng giữa`,"Biceps femoris":`Cơ nhị đầu đùi`,Semitendinosus:`Cơ bán gân`,Semimembranosus:`Cơ bán màng`,Sartorius:`Cơ may`,Gracilis:`Cơ thon`,Gastrocnemius:`Cơ bụng chân (bắp chuối)`,Soleus:`Cơ dép`,"Tibialis anterior":`Cơ chày trước`,Sternocleidomastoid:`Cơ ức đòn chũm`,Masseter:`Cơ cắn`,Temporalis:`Cơ thái dương`,Diaphragm:`Cơ hoành`,Heart:`Quả tim`,Lung:`Phổi`,"Left lung":`Phổi trái`,"Right lung":`Phổi phải`,Brain:`Não bộ`,Liver:`Gan`,Stomach:`Dạ dày`,Duodenum:`Tá tràng`,"Small intestine":`Ruột non`,"Large intestine":`Ruột già (Đại tràng)`,Appendix:`Ruột thừa`,Spleen:`Lách`,Pancreas:`Tụy`,Kidney:`Thận`,"Left kidney":`Thận trái`,"Right kidney":`Thận phải`,"Urinary bladder":`Bàng quang`,Trachea:`Khí quản`,Esophagus:`Thực quản`,"Thyroid gland":`Tuyến giáp`,Gallbladder:`Túi mật`,Aorta:`Động mạch chủ`,"Ascending aorta":`Động mạch chủ lên`,"Aortic arch":`Cung động mạch chủ`,"Abdominal aorta":`Động mạch chủ bụng`,"Thoracic aorta":`Động mạch chủ ngực`,"Superior vena cava":`Tĩnh mạch chủ trên`,"Inferior vena cava":`Tĩnh mạch chủ dưới`,"Pulmonary trunk":`Thân động mạch phổi`,"Pulmonary artery":`Động mạch phổi`,"Pulmonary vein":`Tĩnh mạch phổi`,"Common carotid artery":`Động mạch cảnh chung`,"Internal carotid artery":`Động mạch cảnh trong`,"External carotid artery":`Động mạch cảnh ngoài`,"Femoral artery":`Động mạch đùi`,"Radial artery":`Động mạch quay`,"Ulnar artery":`Động mạch trụ`,"Brachial artery":`Động mạch cánh tay`,"Subclavian artery":`Động mạch dưới đòn`,"Sciatic nerve":`Dây thần kinh tọa (thần kinh ngồi)`,"Femoral nerve":`Dây thần kinh đùi`,"Radial nerve":`Dây thần kinh quay`,"Ulnar nerve":`Dây thần kinh trụ`,"Median nerve":`Dây thần kinh giữa`,"Vagus nerve":`Dây thần kinh phế vị (TK X)`,"Trigeminal nerve":`Dây thần kinh sinh ba (TK V)`,"Facial nerve":`Dây thần kinh mặt (TK VII)`,"Optic nerve":`Dây thần kinh thị giác (TK II)`,"Olfactory nerve":`Dây thần kinh khứu giác (TK I)`},Dd=[{match:/\bcostal cartilage of (.*) rib\b/i,replace:(e,t)=>`Sụn sườn ${Od(t)}`},{match:/\bcostal cartilage\b/i,replace:`Sụn sườn`},{match:/\bfirst rib\b/i,replace:`Xương sườn 1`},{match:/\bsecond rib\b/i,replace:`Xương sườn 2`},{match:/\bthird rib\b/i,replace:`Xương sườn 3`},{match:/\bfourth rib\b/i,replace:`Xương sườn 4`},{match:/\bfifth rib\b/i,replace:`Xương sườn 5`},{match:/\bsixth rib\b/i,replace:`Xương sườn 6`},{match:/\bseventh rib\b/i,replace:`Xương sườn 7`},{match:/\beighth rib\b/i,replace:`Xương sườn 8`},{match:/\bninth rib\b/i,replace:`Xương sườn 9`},{match:/\btenth rib\b/i,replace:`Xương sườn 10`},{match:/\beleventh rib\b/i,replace:`Xương sườn 11`},{match:/\btwelfth rib\b/i,replace:`Xương sườn 12`},{match:/\bproximal phalanx\b/i,replace:`Đốt ngón gần`},{match:/\bmiddle phalanx\b/i,replace:`Đốt ngón giữa`},{match:/\bdistal phalanx\b/i,replace:`Đốt ngón xa`},{match:/\bvertebra\b/i,replace:`Đốt sống`},{match:/\bcartilage\b/i,replace:`Sụn`},{match:/\bmuscle\b/i,replace:`Cơ`},{match:/\bartery\b/i,replace:`Động mạch`},{match:/\bvein\b/i,replace:`Tĩnh mạch`},{match:/\bnerve\b/i,replace:`Dây thần kinh`},{match:/\bligament\b/i,replace:`Dây chằng`},{match:/\btendon\b/i,replace:`Gân`},{match:/\bjoint\b/i,replace:`Khớp`},{match:/\bbone\b/i,replace:`Xương`}];function Od(e){return{first:`1`,second:`2`,third:`3`,fourth:`4`,fifth:`5`,sixth:`6`,seventh:`7`,eighth:`8`,ninth:`9`,tenth:`10`,eleventh:`11`,twelfth:`12`}[e.toLowerCase()]||e}function kd(e){if(!e)return``;let t=e.replace(/^\((.*)\)$/,`$1`).trim();if(Ed[t])return Ed[t];let n=t.toLowerCase();for(let[e,t]of Object.entries(Ed))if(e.toLowerCase()===n)return t;for(let e of Dd)if(e.match.test(t))return e.replace,t.replace(e.match,e.replace);return t}function Ad(e){let t=kd(e);if(!t||t===e)return[];let n=[t],r=t.toLowerCase();return r.includes(`xương đùi`)&&n.push(`đùi`,`bắp đùi`),r.includes(`xương đòn`)&&n.push(`xương quai xanh`,`quai xanh`),r.includes(`cơ delta`)&&n.push(`cơ vai`,`bắp vai`),r.includes(`cơ nhị đầu`)&&n.push(`chuột trước`,`bắp tay trước`),r.includes(`cơ tam đầu`)&&n.push(`chuột sau`,`bắp tay sau`),r.includes(`đốt sống`)&&n.push(`cột sống`,`xương sống`),r.includes(`thần kinh tọa`)&&n.push(`thần kinh ngồi`,`đau dây tọa`),r.includes(`quả tim`)&&n.push(`tim`),n}var jd={".l":`left`,".r":`right`},Md={vi:{left:`trái`,right:`phải`},en:{left:`left`,right:`right`},it:{left:`sinistro`,right:`destro`}},Nd=[`skeletal`,`muscular`,`joints`,`cardiovascular`,`lymphatic`,`nervous`,`visceral`],Pd=`skeletal`;function Fd(e){let t=jd[e.slice(-2)];return t?{base:e.slice(0,-2),side:t}:{base:e,side:null}}function Id(e,t=`vi`){let{base:n,side:r}=Fd(e),i=n.replace(/^\((.*)\)$/,`$1`).trim();if(t===`vi`){let e=kd(i);return r?`${e} (${r===`left`?`trái`:`phải`})`:e}return r?`${i} (${(Md[t]||Md.en)[r]})`:i}async function Ld(){let e=await fetch(lu(`data/systems.json`));if(!e.ok)throw Error(`systems.json: ${e.status} ${e.statusText}`);return e.json()}async function Rd(){try{let e=await fetch(lu(`data/lexicon.json`));return e.ok?await e.json():{}}catch{return{}}}var zd=null;function Bd(){return zd||=fetch(lu(`data/definitions.json`)).then(e=>e.ok?e.json():{}).catch(()=>({})),zd}function Vd(e,t={}){let n={};return Object.entries(e).forEach(([e,r])=>{r.forEach(r=>{let{base:i,side:a}=Fd(r),o=t[i]||{};n[r]={id:r,meshName:r,name:{vi:Id(r,`vi`),en:Id(r,`en`),it:Id(r,`it`)},baseName:i,side:a,system:e,latinName:o.la||``,official:o.official!==!1}})}),n}async function Hd(){try{let[e,t,n]=await Promise.all([fetch(lu(`data/translations/vi.json`)).catch(()=>({ok:!1})),fetch(lu(`data/translations/en.json`)).catch(()=>({ok:!1})),fetch(lu(`data/translations/it.json`)).catch(()=>({ok:!1}))]);Zl({vi:e.ok?await e.json():{},en:t.ok?await t.json():{},it:n.ok?await n.json():{}}),await Kd(),Jd(),X(`dataLoaded`,!0)}catch(e){console.error(`Error loading data:`,e),X(`dataError`,e)}}function Ud(e){return e?e.normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[đĐ]/g,`d`).toLowerCase().trim():``}var Wd={},Gd=new Map;async function Kd(){try{let e=await fetch(lu(`data/synonyms.it.json`));e.ok&&(Wd=await e.json())}catch{Wd={}}Gd=new Map,Object.keys(Wd).forEach(e=>{let t=e.split(` `)[0];Gd.has(t)||Gd.set(t,[]),Gd.get(t).push(e)})}function qd(e){let t=e.split(/[^a-z0-9+]+/).filter(Boolean),n=[];for(let r of new Set(t)){let t=Gd.get(r);if(t)for(let r of t)(e===r||e.includes(r))&&n.push(...Wd[r])}return[...new Set(n)]}function Jd(){if(!Y.partsData)return;let e=new Map;Object.entries(Y.partsData).forEach(([t,n])=>{let r=n.baseName||t,i=n.system||`unknown`,a=`${r}|${i}`,o=e.get(a);if(!o){let t=n.name?.vi||``,s=Ad(r),c=n.latinName||``,l=qd(Ud(r)),u=[Ud(r),Ud(t),Ud(c),...s.map(Ud),...l.map(Ud)].filter(Boolean);o={key:a,base:r,label:t||r.replace(/^\((.*)\)$/,`$1`),latin:c,system:i,sides:{},partIds:[],italian:l,terms:[...new Set(u)]},e.set(a,o)}o.partIds.push(t),o.sides[n.side||`none`]=t}),Ql([...e.values()])}function Yd(e,t,n){let r=0;for(let n of e.terms)n===t?r=Math.max(r,100):n.startsWith(t)?r=Math.max(r,80):n.split(/[\s(),.-]+/).some(e=>e.startsWith(t))?r=Math.max(r,60):n.includes(t)&&(r=Math.max(r,40));if(!r&&n.length>1){let t=e.terms.join(` `);n.every(e=>t.includes(e))&&(r=35)}return r?(Y.loadedSystems.includes(e.system)&&(r+=15),r-=Math.min(e.label.length/12,6),r):0}function Xd(e,t=30){if(!Y.searchIndex||!e)return[];let n=Ud(e);if(n.length<2)return[];let r=n.split(/\s+/).filter(Boolean),i=[];for(let e of Y.searchIndex){let t=Yd(e,n,r);t>0&&i.push({row:e,score:t})}return i.sort((e,t)=>t.score-e.score||e.row.label.length-t.row.label.length),i.slice(0,t).map(e=>e.row)}var Zd=[`muscular`,`lymphatic`,`cardiovascular`,`nervous`,`visceral`,`joints`,`skeletal`],Qd=.05,$d=null;function ef(e){let t=Zd.filter(e=>Y.loadedSystems.includes(e));if(!t.length)return;let n=e/100*t.length;t.forEach((e,t)=>{let r=Math.min(Math.max(1-(n-t),0),1);r<=Qd?Wu(e):(Gu(e),Ku(e,r))})}function tf(){let e=document.getElementById(`viewerContainer`);if(!e||$d)return;let t=document.createElement(`div`);return t.className=`depth-control`,t.innerHTML=`
    <label class="depth-label" for="depthSlider">${Z(`depth`)}</label>
    <input type="range" id="depthSlider" class="depth-slider" min="0" max="100" value="0" step="1"
           orient="vertical" aria-label="${Z(`depth`)}">
  `,e.appendChild(t),$d=t.querySelector(`#depthSlider`),$d.addEventListener(`input`,e=>ef(Number(e.target.value))),t}function nf(){$d&&($d.value=0)}var rf=[{id:`skeleton-front`,label:{vi:`Hệ Xương`,en:`Skeleton, front`,it:`Scheletro, anteriore`},hash:`sys=skeletal&cam=0,0.86,2.6,0,0.86,0`},{id:`thigh-muscles`,label:{vi:`Cơ Bắp & Xương`,en:`Thigh muscles`,it:`Muscoli della coscia`},hash:`sys=skeletal,muscular&cam=0.15,0.75,1.25,0.05,0.72,0`},{id:`heart-vessels`,label:{vi:`Tim Mạch`,en:`Heart and great vessels`,it:`Cuore e grandi vasi`},hash:`sys=cardiovascular&cam=0,1.28,0.75,0,1.28,0`},{id:`nervous-spine`,label:{vi:`Thần Kinh & Não`,en:`Nervous system`,it:`Sistema nervoso`},hash:`sys=skeletal,nervous&cam=0,1.4,1.2,0,1.4,0`}];function af(e){window.location.hash=e.hash,window.location.reload()}var of=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex="-1"])`].join(`,`);function sf(e){return[...e.querySelectorAll(of)].filter(e=>e.offsetParent!==null||e===document.activeElement)}function cf(e,t){e&&(t?(e.setAttribute(`inert`,``),e.setAttribute(`aria-hidden`,`true`)):(e.removeAttribute(`inert`),e.removeAttribute(`aria-hidden`)))}function lf(e){let[t]=sf(e);return t&&t.focus(),!!t}function uf(e,{onEscape:t,returnFocusTo:n}={}){let r=n||document.activeElement;function i(n){if(n.key===`Escape`){n.stopPropagation(),t?.();return}if(n.key!==`Tab`)return;let r=sf(e);if(!r.length)return;let i=r[0],a=r[r.length-1],o=document.activeElement;n.shiftKey&&(o===i||!e.contains(o))?(n.preventDefault(),a.focus()):!n.shiftKey&&o===a&&(n.preventDefault(),i.focus())}return e.addEventListener(`keydown`,i),lf(e),function({restoreFocus:t=!0}={}){e.removeEventListener(`keydown`,i),t&&r?.isConnected&&r.focus()}}function df(e,{itemSelector:t,onActivate:n}){function r(){return[...e.querySelectorAll(t)]}function i(e,t){let n=e[Math.max(0,Math.min(t,e.length-1))];n&&(e.forEach(e=>e.setAttribute(`tabindex`,e===n?`0`:`-1`)),n.focus())}return e.addEventListener(`keydown`,e=>{let a=e.target.closest(t);if(!a)return;let o=r(),s=o.indexOf(a);switch(e.key){case`ArrowDown`:e.preventDefault(),i(o,s+1);break;case`ArrowUp`:e.preventDefault(),i(o,s-1);break;case`Home`:e.preventDefault(),i(o,0);break;case`End`:e.preventDefault(),i(o,o.length-1);break;case`Enter`:case` `:if(e.target!==a)break;e.preventDefault(),n?.(a);break;default:}}),function(){let e=r();!e.some(e=>e.getAttribute(`tabindex`)===`0`)&&e.length&&e.forEach((e,t)=>e.setAttribute(`tabindex`,t===0?`0`:`-1`))}}var ff=[{id:`head_neck`,labelVi:`Đầu - Mặt - Cổ`,labelEn:`Head & Neck`,icon:`👤`,camera:{x:0,y:1.6,z:.7,targetX:0,targetY:1.55,targetZ:0},keywords:[`cranium`,`frontal`,`parietal`,`occipital`,`temporal`,`mandible`,`maxilla`,`atlas`,`axis`,`cervical`,`hyoid`,`head`,`neck`,`brain`]},{id:`spine`,labelVi:`Cột sống & Thân mình`,labelEn:`Spine & Trunk`,icon:`🦴`,camera:{x:0,y:1.15,z:1.2,targetX:0,targetY:1.1,targetZ:0},keywords:[`vertebra`,`vertebrae`,`atlas`,`axis`,`sacrum`,`coccyx`,`intervertebral`,`spine`]},{id:`thorax`,labelVi:`Lồng ngực & Tim Phổi`,labelEn:`Thorax`,icon:`🫁`,camera:{x:0,y:1.25,z:1,targetX:0,targetY:1.25,targetZ:0},keywords:[`sternum`,`rib`,`costa`,`costal`,`thorax`,`thoracic`,`heart`,`lung`]},{id:`pelvis`,labelVi:`Bụng & Khung chậu`,labelEn:`Abdomen & Pelvis`,icon:`🩻`,camera:{x:0,y:.95,z:.9,targetX:0,targetY:.92,targetZ:0},keywords:[`hip`,`ilium`,`ischium`,`pubis`,`pelvis`,`sacrum`,`bladder`,`stomach`,`liver`]},{id:`upper_limb`,labelVi:`Chi trên (Tay & Khớp vai)`,labelEn:`Upper Limb`,icon:`💪`,camera:{x:.35,y:1.1,z:1,targetX:.25,targetY:1.05,targetZ:0},keywords:[`clavicle`,`scapula`,`humerus`,`radius`,`ulna`,`carpal`,`metacarpal`,`phalanx`,`hand`,`arm`]},{id:`lower_limb`,labelVi:`Chi dưới (Chân & Khớp gối)`,labelEn:`Lower Limb`,icon:`🦵`,camera:{x:0,y:.45,z:1.4,targetX:0,targetY:.45,targetZ:0},keywords:[`femur`,`patella`,`tibia`,`fibula`,`tarsal`,`metatarsal`,`foot`,`calcaneus`,`talus`,`leg`]}],pf=`anatomy_bookmarks_v1`,mf=`anatomy_history_v1`;function hf(){try{let e=localStorage.getItem(pf);return e?JSON.parse(e):[]}catch{return[]}}function gf(e){return e?hf().some(t=>t.id===e):!1}function _f(e,t={}){if(!e)return!1;let n=hf(),r=n.findIndex(t=>t.id===e),i=!1;r>=0?(n.splice(r,1),i=!1):(n.unshift({id:e,nameVi:t.nameVi||e,nameLatin:t.nameLatin||``,system:t.system||``,time:Date.now()}),i=!0);try{localStorage.setItem(pf,JSON.stringify(n))}catch(e){console.error(`Failed to save bookmark:`,e)}return i}function vf(){try{let e=localStorage.getItem(mf);return e?JSON.parse(e):[]}catch{return[]}}function yf(e,t={}){if(!e)return;let n=vf();n=n.filter(t=>t.id!==e),n.unshift({id:e,nameVi:t.nameVi||e,nameLatin:t.nameLatin||``,system:t.system||``,time:Date.now()}),n.length>20&&(n=n.slice(0,20));try{localStorage.setItem(mf,JSON.stringify(n))}catch(e){console.error(`Failed to save history:`,e)}}var bf=[{id:`Cranium`,nameVi:`Xương sọ (Vòm sọ)`,nameLatin:`Calvaria`,pos:[0,1.68,.08],partId:`Frontal bone`},{id:`Orbit`,nameVi:`Hốc mắt`,nameLatin:`Orbita`,pos:[.06,1.58,.12],partId:`Zygomatic bone.l`},{id:`Mandible`,nameVi:`Xương hàm dưới`,nameLatin:`Mandibula`,pos:[0,1.52,.11],partId:`Mandible`},{id:`Cervical`,nameVi:`Đốt sống cổ C1-C7`,nameLatin:`Vertebrae cervicales`,pos:[0,1.44,-.05],partId:`Atlas`},{id:`Clavicle`,nameVi:`Xương đòn (Quai xanh)`,nameLatin:`Clavicula`,pos:[.12,1.39,.07],partId:`Clavicle.l`},{id:`Acromion`,nameVi:`Mỏm cùng vai`,nameLatin:`Acromion`,pos:[.22,1.38,.02],partId:`Scapula.l`},{id:`Sternum`,nameVi:`Xương ức`,nameLatin:`Sternum`,pos:[0,1.28,.12],partId:`Body of sternum`},{id:`Ribcage`,nameVi:`Lồng ngực / Xương sườn`,nameLatin:`Cavea thoracis`,pos:[.18,1.22,.09],partId:`First rib.l`},{id:`ThoracicSpine`,nameVi:`Cột sống ngực T1-T12`,nameLatin:`Vertebrae thoracicae`,pos:[0,1.24,-.08],partId:`First rib.l`},{id:`LumbarSpine`,nameVi:`Cột sống thắt lưng L1-L5`,nameLatin:`Vertebrae lumbales`,pos:[0,1.1,-.07],partId:`Lumbar vertebra I`},{id:`Humerus`,nameVi:`Xương cánh tay`,nameLatin:`Humerus`,pos:[.24,1.18,.02],partId:`Humerus.l`},{id:`Elbow`,nameVi:`Khớp khuỷu / Mỏm khuỷu`,nameLatin:`Olecranon`,pos:[.27,1.05,-.01],partId:`Ulna.l`},{id:`Radius`,nameVi:`Xương quay (Cẳng tay ngoài)`,nameLatin:`Radius`,pos:[.29,.94,.02],partId:`Radius.l`},{id:`Ulna`,nameVi:`Xương trụ (Cẳng tay trong)`,nameLatin:`Ulna`,pos:[.25,.94,.01],partId:`Ulna.l`},{id:`Wrist`,nameVi:`Khớp cổ tay & Xương cổ tay`,nameLatin:`Carpus`,pos:[.31,.83,.02],partId:`Radius.l`},{id:`Hand`,nameVi:`Xương bàn tay & Ngón`,nameLatin:`Ossa manus`,pos:[.33,.74,.02],partId:`Radius.l`},{id:`IliacCrest`,nameVi:`Mào chậu (Đỉnh eo)`,nameLatin:`Crista iliaca`,pos:[.17,1.03,.02],partId:`Hip bone.l`},{id:`Pelvis`,nameVi:`Xương chậu (Cánh chậu)`,nameLatin:`Os coxae`,pos:[.14,.96,.05],partId:`Hip bone.l`},{id:`Sacrum`,nameVi:`Xương cùng`,nameLatin:`Os sacrum`,pos:[0,.92,-.05],partId:`Sacrum`},{id:`Coccyx`,nameVi:`Xương cụt`,nameLatin:`Os coccygis`,pos:[0,.86,-.06],partId:`Coccyx`},{id:`Trochanter`,nameVi:`Mấu chuyển lớn đùi`,nameLatin:`Trochanter major`,pos:[.19,.86,.02],partId:`Femur.l`},{id:`Femur`,nameVi:`Xương đùi`,nameLatin:`Os femoris`,pos:[.14,.68,.03],partId:`Femur.l`},{id:`Patella`,nameVi:`Xương bánh chè`,nameLatin:`Patella`,pos:[.12,.46,.1],partId:`Patella.l`},{id:`KneeJoint`,nameVi:`Khớp gối`,nameLatin:`Articulatio genus`,pos:[.12,.44,.04],partId:`Patella.l`},{id:`Tibia`,nameVi:`Xương chày (Chịu lực chính)`,nameLatin:`Tibia`,pos:[.11,.28,.05],partId:`Tibia.l`},{id:`Fibula`,nameVi:`Xương mác (Cẳng chân ngoài)`,nameLatin:`Fibula`,pos:[.16,.28,.02],partId:`Fibula.l`},{id:`AnkleMedial`,nameVi:`Mắt cá trong`,nameLatin:`Malleolus medialis`,pos:[.08,.11,.03],partId:`Tibia.l`},{id:`AnkleLateral`,nameVi:`Mắt cá ngoài`,nameLatin:`Malleolus lateralis`,pos:[.16,.11,.02],partId:`Fibula.l`},{id:`Calcaneus`,nameVi:`Xương gót chân`,nameLatin:`Calcaneus`,pos:[.12,.05,-.04],partId:`Calcaneus.l`},{id:`Foot`,nameVi:`Xương bàn chân & Vòm chân`,nameLatin:`Ossa pedis`,pos:[.12,.04,.1],partId:`Calcaneus.l`}],xf=null,Sf=!1,Cf=new Map;function wf(e){if(xf)return;let t=document.getElementById(`viewerContainer`);t&&(xf=document.createElement(`div`),xf.className=`labels-overlay`,xf.id=`labelsOverlay`,xf.style.display=`none`,t.appendChild(xf),bf.forEach(t=>{let n=document.createElement(`div`);n.className=`landmark-pin`,n.dataset.landmarkId=t.id,n.innerHTML=`
      <span class="pin-dot"></span>
      <span class="pin-text">${t.nameVi}</span>
    `,n.addEventListener(`click`,n=>{n.stopPropagation(),t.partId&&sg(t.partId,e),navigator.vibrate&&navigator.vibrate(25)}),xf.appendChild(n),Cf.set(t.id,n)}),e.onFrame&&e.onFrame(()=>Tf(e)))}function Tf(e){if(!Sf||!xf)return;let{camera:t,canvas:n}=e,r=n.getBoundingClientRect(),i=r.width,a=r.height,o=new U;bf.forEach(e=>{let n=Cf.get(e.id);if(!n)return;o.set(e.pos[0],e.pos[1],e.pos[2]),o.project(t);let r=o.z<1&&o.z>-1,s=o.x>=-1.1&&o.x<=1.1&&o.y>=-1.1&&o.y<=1.1;if(r&&s){let e=(o.x*.5+.5)*i,t=(-o.y*.5+.5)*a;n.style.transform=`translate3d(${e}px, ${t}px, 0)`,n.style.display=`flex`,n.style.opacity=Math.max(.2,1-o.z*.5)}else n.style.display=`none`})}function Ef(e,t){Sf=e,xf&&(xf.style.display=Sf?`block`:`none`),t&&(Tf(t),t.render())}function Df(e){return Ef(!Sf,e),Sf}var Of=0,kf=new Map;function Af(e){if(kf.has(e))return kf.get(e);e.userData._basePosition||(e.userData._basePosition=e.position.clone());let t=new ft().setFromObject(e),n=new U;t.getCenter(n);let r=(e.name||``).toLowerCase(),i=n.x*2.2,a=(n.y-1)*.9,o=n.z*2;r.includes(`vertebra`)||r.includes(`atlas`)||r.includes(`axis`)||r.includes(`sacrum`)||r.includes(`coccyx`)?(a=(n.y-1.1)*2,i=n.x*.5,o=(n.z+.05)*1.5):r.includes(`rib`)||r.includes(`costa`)||r.includes(`sternum`)?(i=n.x*2.8,o=n.z*2.6,a=(n.y-1.25)*.8):r.includes(`cranium`)||r.includes(`frontal`)||r.includes(`parietal`)||r.includes(`occipital`)||r.includes(`temporal`)||r.includes(`maxilla`)||r.includes(`mandible`)?(i=n.x*3,a=(n.y-1.65)*2.5,o=(n.z-.05)*2.8):r.includes(`scapula`)||r.includes(`clavicle`)||r.includes(`humerus`)||r.includes(`radius`)||r.includes(`ulna`)||r.includes(`carpal`)||r.includes(`hand`)?(i=n.x*2.5,a=(n.y-1.2)*.5,o=n.z*1.2):(r.includes(`femur`)||r.includes(`patella`)||r.includes(`tibia`)||r.includes(`fibula`)||r.includes(`tarsal`)||r.includes(`foot`))&&(i=n.x*2.2,a=(n.y-.8)*.7,o=n.z*1.5);let s=new U(i,a,o);return kf.set(e,s),s}function jf(e,t){Of=Math.max(0,Math.min(1,e)),gu().forEach(e=>{e.traverse(e=>{if(e.isMesh)if(e.userData._basePosition||(e.userData._basePosition=e.position.clone()),Of===0)e.position.copy(e.userData._basePosition);else{let t=Af(e);e.position.copy(e.userData._basePosition).addScaledVector(t,Of*.35)}})}),t&&t.render()}var Mf={"Lumbar vertebra":{nameVi:`Đốt sống thắt lưng (L1 - L5)`,nameLatin:`Vertebrae lumbales (TA2: 1045)`,nameEn:`Lumbar vertebrae`,regionVi:`Cột sống & Thân mình`,systemVi:`Hệ Xương`,description:`Gồm 5 đốt sống lớn nhất trong cột sống, thân đốt hình quả thận chịu lực, cuống cung dày, lỗ đốt sống hình tam giác. Chịu tải trọng chính của toàn bộ nửa trên cơ thể.`,function:`Nâng đỡ trọng lượng cơ thể, cho phép cúi gập, ngửa, nghiêng và xoay nhẹ thân mình; bảo vệ đoạn chóp tủy và chùm đuôi ngựa (Cauda equina).`,clinical:`Khu vực có tỷ lệ thoát vị đĩa đệm cao nhất (đặc biệt tầng L4-L5 và L5-S1), thoái hóa cột sống, trượt đốt sống (Spondylolisthesis), chèn ép rễ thần kinh tọa gây đau lan xuống mặt sau đùi và bàn chân.`,relations:{muscles:`Cơ thắt lưng chậu (Psoas major), cơ vuông thắt lưng (Quadratus lumborum), các cơ dựng gai sống (Erector spinae), cơ nhiều chân (Multifidus).`,bones:`Khớp với đốt sống ngực T12 ở trên, đĩa đệm gian đốt sống ở giữa các thân đốt, và khớp với xương cùng S1 ở dưới.`,nerves:`Đoạn cuối tủy gai (kết thúc ở L1-L2), đám rối thần kinh thắt lưng (L1-L4), chùm đuôi ngựa và các rễ thần kinh thắt lưng.`,vessels:`Động mạch chủ bụng (Abdominal aorta) chạy trước thân đốt sống, các nhánh động mạch thắt lưng (Lumbar arteries) nuôi dưỡng xương và tủy.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Cột Sống Thắt Lưng: Cơ Sinh Học & Phòng Ngừa Thoát Vị`,videoId:`3ZfVjV7VqJ8`},Atlas:{nameVi:`Đốt sống cổ C1 (Đốt đội)`,nameLatin:`Atlas (Vertebra cervicalis I) (TA2: 1018)`,nameEn:`Atlas (C1 vertebra)`,regionVi:`Đầu - Mặt - Cổ`,systemVi:`Hệ Xương`,description:`Đốt sống cổ thứ nhất, có cấu tạo vòng xương đặc biệt không có thân đốt và mỏm gai, gồm cung trước và cung sau với hai khối bên mang diện khớp trên lõm.`,function:`Nâng đỡ trực tiếp hộp sọ thông qua khớp đội - chẩm; cho phép động tác gật đầu (cúi và ngửa đầu quanh trục ngang).`,clinical:`Gãy bung Jefferson do chấn thương dồn nén theo trục đứng từ đỉnh đầu; mất vững khớp đội - trục đe dọa trực tiếp hành tủy và trung tâm hô hấp.`,relations:{muscles:`Cơ thẳng đầu sau bé, cơ chéo đầu trên, cơ chéo đầu dưới, cơ nâng vai (Levator scapulae).`,bones:`Khớp đội - chẩm ở trên với lồi cầu xương chẩm; khớp đội - trục ở dưới với đốt C2 (Axis).`,nerves:`Dây thần kinh gai sống cổ C1 (Thần kinh dưới chẩm), hạch thần kinh giao cảm cổ trên.`,vessels:`Động mạch đốt sống (Vertebral artery) đi qua lỗ mỏm ngang C1 uốn quanh cung sau vào hộp sọ.`},lessonLink:`/cot-song/dot-song-co`,lessonTitle:`Đốt Sống Cổ: Chăm Sóc Đốt Đội C1 & Khớp Bản Lề`,videoId:`fGjG7V3A2sQ`},Axis:{nameVi:`Đốt sống cổ C2 (Đốt trục)`,nameLatin:`Axis (Vertebra cervicalis II) (TA2: 1022)`,nameEn:`Axis (C2 vertebra)`,regionVi:`Đầu - Mặt - Cổ`,systemVi:`Hệ Xương`,description:`Đốt sống cổ thứ hai, nhận diện bởi mỏm răng (Dens / Odontoid process) nhô thẳng lên trên đóng vai trò chốt quay cho đốt C1.`,function:`Tạo trục xoay chính cho đầu và cổ, đảm nhiệm hơn 50% biên độ cử động xoay trái - phải của toàn bộ cột sống cổ.`,clinical:`Gãy mỏm răng C2 trong tai nạn giao thông hoặc ngã va đập cằm; hội chứng cổ vai gáy do chèn ép thần kinh chẩm lớn.`,relations:{muscles:`Cơ thẳng đầu sau lớn, cơ chéo đầu dưới, cơ gối đầu (Splenius capitis).`,bones:`Tiếp khớp với cung trước đốt C1 qua mỏm răng; khớp với đốt sống cổ C3 ở dưới.`,nerves:`Dây thần kinh chẩm lớn (Greater occipital nerve) vòng quanh bờ dưới cơ chéo đầu dưới.`,vessels:`Động mạch đốt sống (Vertebral artery) đi qua lỗ ngang C2.`},lessonLink:`/cot-song/dot-song-co`,lessonTitle:`Đốt Trục C2 & Tầm Vận Động Cột Sống Cổ`,videoId:`fGjG7V3A2sQ`},"Cervical vertebra":{nameVi:`Đốt sống cổ C3 - C7`,nameLatin:`Vertebrae cervicales (TA2: 1017)`,nameEn:`Cervical vertebrae`,regionVi:`Đầu - Mặt - Cổ`,systemVi:`Hệ Xương`,description:`Thân đốt nhỏ dẹt, mỏm gai chẻ đôi (C2-C6), đặc trưng bởi lỗ mỏm ngang để động mạch đốt sống đi qua. C7 là đốt sống lồi có mỏm gai dài nhất sờ thấy dưới da gáy.`,function:`Tạo sự linh hoạt tối đa cho vùng đầu cổ, bảo vệ tủy cổ và các rễ thần kinh điều khiển chi trên.`,clinical:`Hội chứng thoái hóa cột sống cổ, gai đốt sống chèn ép rễ thần kinh cánh tay (C5-C7) gây tê bì ngón tay; hội chứng Text Neck do cúi nhìn màn hình thời gian dài.`,relations:{muscles:`Nhóm cơ bậc thang (Scalene muscles), cơ ức đòn chũm, cơ thang, cơ dài cổ.`,bones:`Khớp liên đốt sống cổ, khớp mỏm móc (Luschka).`,nerves:`Đám rối thần kinh cánh tay (Brachial plexus C5-T1), thần kinh hoành (Phrenic nerve C3-C5).`,vessels:`Động mạch đốt sống, động mạch cổ sâu, tĩnh mạch cảnh trong.`},lessonLink:`/cot-song/dot-song-co`,lessonTitle:`Phục Hồi Cổ Vai Gáy Cho Người Văn Phòng`,videoId:`fGjG7V3A2sQ`},"Thoracic vertebra":{nameVi:`Đốt sống ngực (T1 - T12)`,nameLatin:`Vertebrae thoracicae (TA2: 1033)`,nameEn:`Thoracic vertebrae`,regionVi:`Lồng ngực & Lưng`,systemVi:`Hệ Xương`,description:`Gồm 12 đốt sống có các hố sườn trên thân và mỏm ngang để khớp với đầu và củ xương sườn. Mỏm gai chúc dài xuống dưới như ngói lợp.`,function:`Kết hợp cùng xương sườn và xương ức tạo nên lồng ngực vững chắc bảo vệ tim, phổi và các tạng trung thất; điểm tựa cho nhịp thở.`,clinical:`Gù vẹo cột sống ngực (Thoracic kyphoscoliosis), đau dây thần kinh liên sườn, loãng xương gây xẹp lún đốt sống ở người lớn tuổi.`,relations:{muscles:`Cơ gian sườn, cơ trám (Rhomboids), cơ lưng rộng (Latissimus dorsi), cơ nâng sườn.`,bones:`Khớp với 12 đôi xương sườn (Khớp sườn sống và khớp sườn mỏm ngang).`,nerves:`Dây thần kinh liên sườn (Intercostal nerves), chuỗi hạch giao cảm cạnh sống.`,vessels:`Động mạch gian sườn sau (Posterior intercostal arteries), tĩnh mạch đơn (Azygos vein).`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Cột Sống Ngực & Cơ Chế Hô Hấp Đúng`,videoId:`3ZfVjV7VqJ8`},Sacrum:{nameVi:`Xương cùng (S1 - S5)`,nameLatin:`Os sacrum (TA2: 1056)`,nameEn:`Sacrum`,regionVi:`Khung chậu`,systemVi:`Hệ Xương`,description:`Xương hình chêm tam giác lớn tạo bởi 5 đốt sống cùng dính liền, nằm giữa hai xương cánh chậu tạo nên vòm sau của khung chậu.`,function:`Là nền móng chịu lực truyền tải trọng lượng từ cột sống xuống đai chậu và hai chân; bảo vệ các nhánh thần kinh chùm đuôi ngựa.`,clinical:`Viêm khớp cùng chậu (Sacroiliitis) trong bệnh viêm cột sống dính khớp (Ankylosing spondylitis), đau vùng khớp cùng chậu khi mang thai hoặc sau chấn thương.`,relations:{muscles:`Cơ hình lê (Piriformis), cơ mông lớn (Gluteus maximus), cơ nhiều chân cùng.`,bones:`Khớp cùng - chậu (Sacroiliac joint) với hai xương chậu, khớp cùng - cụt ở dưới, khớp L5-S1 ở trên.`,nerves:`Đám rối thần kinh cùng (Sacral plexus L4-S4), dây thần kinh tọa (Sciatic nerve).`,vessels:`Động mạch cùng giữa, động mạch cùng bên, đám rối tĩnh mạch cùng.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Khớp Cùng Chậu & Cân Bằng Khung Xương`,videoId:`yU8C5r4N8w0`},Coccyx:{nameVi:`Xương cụt (Co1 - Co4)`,nameLatin:`Os coccygis (TA2: 1068)`,nameEn:`Coccyx (Tailbone)`,regionVi:`Khung chậu`,systemVi:`Hệ Xương`,description:`Đoạn xương nhỏ hình tam giác tận cùng của cột sống, gồm 3 đến 5 đốt sống thoái hóa dính liền nhau.`,function:`Điểm bám cốt lõi của các dây chằng và cơ đáy chậu nâng đỡ sàn chậu; điểm tựa khi ngồi ngả lưng.`,clinical:`Đau xương cụt (Coccydynia) do ngã đập mông hoặc sinh nở khó; đau tăng rõ rệt khi ngồi ghế cứng lâu.`,relations:{muscles:`Cơ cụt (Coccygeus), cơ nâng hậu môn (Levator ani), cơ thắt ngoài hậu môn.`,bones:`Khớp cùng - cụt (Sacrococcygeal symphysis).`,nerves:`Đám rối thần kinh cụt, hạch lẻ (Ganglion impar).`,vessels:`Nhánh tận của động mạch cùng giữa.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Đáy Chậu & Chăm Sóc Vùng Xương Cụt`,videoId:`yU8C5r4N8w0`},"Body of sternum":{nameVi:`Xương ức`,nameLatin:`Sternum (TA2: 1079)`,nameEn:`Sternum (Breastbone)`,regionVi:`Lồng ngực`,systemVi:`Hệ Xương`,description:`Xương dẹt phẳng ở đường giữa trước lồng ngực gồm 3 phần: cán ức (Manubrium), thân ức (Body) và mỏm kiếm (Xiphoid process).`,function:`Khóa chặt mặt trước lồng ngực, bảo vệ tim và mạch máu lớn; điểm tựa chuyển động hô hấp của các xương sườn.`,clinical:`Vị trí đặt tay hồi sinh tim phổi (CPR); cưa xương ức trong phẫu thuật mở lồng ngực; viêm sụn sườn (Tietze syndrome).`,relations:{muscles:`Cơ ngực lớn (Pectoralis major), cơ ức đòn chũm, cơ hoành bám vào mỏm kiếm.`,bones:`Tiếp khớp với hai xương đòn và sụn sườn của 7 đôi xương sườn đầu tiên.`,nerves:`Các nhánh bì trước của dây thần kinh liên sườn.`,vessels:`Động mạch ngực trong (Internal thoracic artery) chạy dọc hai bên bờ xương ức.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Lồng Ngực & Nhịp Thở Sinh Lý`,videoId:`3ZfVjV7VqJ8`},"First rib":{nameVi:`Xương sườn & Cung sườn`,nameLatin:`Costae (TA2: 1087)`,nameEn:`Ribs (12 pairs)`,regionVi:`Lồng ngực`,systemVi:`Hệ Xương`,description:`Gồm 12 đôi xương dẹt cong hình cung: 7 đôi sườn thật khớp trực tiếp với xương ức, 3 đôi sườn giả nối qua sụn sườn 7, và 2 đôi sườn cụt lơ lửng.`,function:`Nâng lên và hạ xuống thay đổi thể tích lồng ngực tạo nhịp thở; bảo vệ tim, phổi, gan, lách và dạ dày.`,clinical:`Gãy xương sườn do va đập chấn thương ngực (nguy cơ tràn khí, tràn máu màng phổi); mảng sườn di động trong chấn thương nặng.`,relations:{muscles:`Cơ gian sườn ngoài, cơ gian sườn trong, cơ răng trước (Serratus anterior), cơ bậc thang.`,bones:`Khớp với các đốt sống ngực ở phía sau và xương ức (qua sụn sườn) ở phía trước.`,nerves:`Dây thần kinh liên sườn chạy trong rãnh sườn ở bờ dưới mỗi xương.`,vessels:`Bó mạch gian sườn (Động mạch và tĩnh mạch liên sườn) đi cùng thần kinh trong rãnh sườn.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Lồng Ngực & Cơ Hoành Hô Hấp`,videoId:`3ZfVjV7VqJ8`},"Hip bone":{nameVi:`Xương chậu (Xương hông)`,nameLatin:`Os coxae (TA2: 1111)`,nameEn:`Hip bone (Pelvic bone)`,regionVi:`Khung chậu`,systemVi:`Hệ Xương`,description:`Xương dẹt lớn cấu thành từ 3 xương hợp nhất tại ổ cối: xương cánh chậu (Ilium) ở trên, xương ngồi (Ischium) ở sau dưới và xương mu (Pubis) ở trước dưới.`,function:`Bảo vệ các tạng trong tiểu khung (bàng quang, tử cung/tuyến tiền liệt, trực tràng); truyền toàn bộ trọng lượng thân mình xuống hai đùi.`,clinical:`Lệch khung chậu do thói quen vắt chéo chân, gác chân cao hoặc mang vác lệch bên; thoái hóa khớp háng (Coxarthrosis); gãy xương chậu trong tai nạn năng lượng cao.`,relations:{muscles:`Cơ mông lớn, nhỡ, bé; cơ thắt lưng chậu; các cơ khép đùi; cơ thẳng bụng.`,bones:`Khớp cùng - chậu ở sau, khớp mu ở trước, ổ cối (Acetabulum) tiếp khớp chỏm xương đùi.`,nerves:`Dây thần kinh đùi (Femoral nerve), dây thần kinh bịt, dây thần kinh tọa.`,vessels:`Động mạch chậu chung, động mạch chậu trong và động mạch chậu ngoài.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Khung Chậu: Cân Bằng Trọng Tâm & Dáng Đi`,videoId:`yU8C5r4N8w0`},Femur:{nameVi:`Xương đùi`,nameLatin:`Os femoris (TA2: 1133)`,nameEn:`Femur (Thigh bone)`,regionVi:`Chi dưới (Chân)`,systemVi:`Hệ Xương`,description:`Xương dài nhất, nặng nhất và chắc khỏe nhất trong cơ thể con người. Gồm chỏm hình cầu, cổ xương đùi, mấu chuyển lớn, mấu chuyển bé, thân xương cong lồi ra trước và hai lồi cầu.`,function:`Chịu lực chống đỡ toàn thân khi đứng, chạy nhảy; tạo cánh tay đòn chuyển động cho các cơ đùi cực mạnh.`,clinical:`Gãy cổ xương đùi ở người cao tuổi do loãng xương (nguy cơ hoại tử vô mạch chỏm xương đùi); gãy thân xương đùi trong tai nạn giao thông.`,relations:{muscles:`Cơ tứ đầu đùi (Quadriceps femoris), nhóm cơ ụ ngồi cẳng chân (Hamstrings), các cơ khép, cơ mông.`,bones:`Khớp háng ở trên với ổ cối xương chậu; khớp gối ở dưới với xương chày và xương bánh chè.`,nerves:`Dây thần kinh đùi ở trước, dây thần kinh tọa (Sciatic nerve) chạy sát mặt sau thân xương đùi.`,vessels:`Động mạch đùi (Femoral artery) và động mạch đùi sâu cung cấp máu chính cho toàn bộ chi dưới.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Khớp Háng & Trục Chịu Lực Chi Dưới`,videoId:`yU8C5r4N8w0`},Patella:{nameVi:`Xương bánh chè`,nameLatin:`Patella (TA2: 1152)`,nameEn:`Patella (Kneecap)`,regionVi:`Chi dưới (Khớp gối)`,systemVi:`Hệ Xương`,description:`Xương vừng lớn nhất cơ thể người, hình tam giác dẹt nằm bên trong gân cơ tứ đầu đùi ở mặt trước khớp gối.`,function:`Tăng cánh tay đòn cơ học cho cơ tứ đầu đùi giúp duỗi gối hiệu quả hơn 30%; bảo vệ các cấu trúc bên trong khớp gối khỏi va chạm trực tiếp.`,clinical:`Hội chứng đau khớp bánh chè - đùi (Patellofemoral pain syndrome); nhuyễn sụn bánh chè; vỡ xương bánh chè do ngã đập gối xuống mặt cứng.`,relations:{muscles:`Gân cơ tứ đầu đùi bám bờ trên, dây chằng bánh chè (Patellar ligament) nối bờ dưới với lồi củ chày.`,bones:`Tiếp khớp với diện bánh chè của đầu dưới xương đùi tạo thành khớp bánh chè - đùi.`,nerves:`Các nhánh thần kinh bì trước của thần kinh đùi.`,vessels:`Mạng mạch quanh khớp gối (Genicular anastomosis).`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Chăm Sóc & Bảo Tồn Khớp Gối`,videoId:`3ZfVjV7VqJ8`},Tibia:{nameVi:`Xương chày`,nameLatin:`Tibia (TA2: 1156)`,nameEn:`Tibia (Shinbone)`,regionVi:`Chi dưới (Cẳng chân)`,systemVi:`Hệ Xương`,description:`Xương lớn chịu lực chính của cẳng chân, nằm ở phía trong. Đầu trên có mâm chày và lồi củ chày; thân xương hình lăng trụ tam giác có bờ trước sắc nằm sát dưới da; đầu dưới có mắt cá trong.`,function:`Chịu tải 85-90% trọng lượng cơ thể từ xương đùi truyền xuống cổ chân và bàn chân.`,clinical:`Gãy hở xương chày do bờ trước nằm sát dưới da; thoái hóa khớp gối mâm chày; hội chứng nẹp cẳng chân (Shin splints) ở người chạy bộ.`,relations:{muscles:`Cơ chày trước (Tibialis anterior), cơ chày sau, cơ dép, gân cơ bánh chè bám lồi củ chày.`,bones:`Khớp với xương đùi ở trên, xương mác ở ngoài, và xương sên (Talus) ở dưới.`,nerves:`Dây thần kinh mác sâu và thần kinh chày.`,vessels:`Động mạch chày trước và động mạch chày sau.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Trục Cẳng Chân & Phục Hồi Khớp Cổ Chân`,videoId:`yU8C5r4N8w0`},Fibula:{nameVi:`Xương mác`,nameLatin:`Fibula (TA2: 1172)`,nameEn:`Fibula (Calf bone)`,regionVi:`Chi dưới (Cẳng chân)`,systemVi:`Hệ Xương`,description:`Xương mảnh nằm ở phía ngoài cẳng chân, song song với xương chày. Đầu trên là chỏm mác, đầu dưới mở rộng tạo nên mắt cá ngoài.`,function:`Không chịu tải chính mà là nơi bám của nhiều nhóm cơ cẳng chân; mắt cá ngoài đóng vai trò then chốt giữ vững mộng chày - mác cổ chân.`,clinical:`Tổn thương thần kinh mác chung vòng quanh cổ xương mác gây liệt bàn chân rủ (không nhấc mũi chân lên được); gãy mắt cá ngoài trong lật cổ chân.`,relations:{muscles:`Cơ mác dài, cơ mác ngắn, cơ gấp ngón cái dài, cơ dép.`,bones:`Tiếp khớp với xương chày ở khớp chày mác trên và dưới; khớp với xương sên ở cổ chân.`,nerves:`Dây thần kinh mác chung (Common fibular nerve) uốn quanh cổ xương mác ngay dưới da.`,vessels:`Động mạch mác (Fibular artery) tách từ động mạch chày sau.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Cổ Chân & Phòng Ngừa Lật Sơ Mi`,videoId:`yU8C5r4N8w0`},Calcaneus:{nameVi:`Xương gót chân`,nameLatin:`Calcaneus (TA2: 1184)`,nameEn:`Calcaneus (Heel bone)`,regionVi:`Bàn chân`,systemVi:`Hệ Xương`,description:`Xương lớn nhất và khỏe nhất trong khối xương cổ chân, nằm ở phía sau dưới bàn chân tạo nên hình dáng của gót chân.`,function:`Là điểm tựa chịu lực đầu tiên khi bước đi (gót chạm đất); điểm bám đòn bẩy của gân gót Achilles giúp kiễng gót và đẩy cơ thể về phía trước.`,clinical:`Viêm cân gan chân (Plantar fasciitis) gây đau thốn gót khi bước bước chân đầu tiên buổi sáng; gai xương gót; đứt gân gót Achilles.`,relations:{muscles:`Gân gót Achilles (Cơ bụng chân và cơ dép bám vào củ gót), cân gan chân, cơ dạng ngón cái.`,bones:`Khớp với xương sên ở trên (Khớp dưới sên) và xương hộp (Cuboid) ở phía trước.`,nerves:`Các nhánh thần kinh gan chân trong và gan chân ngoài.`,vessels:`Nhánh gót của động mạch chày sau và động mạch mác.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Vòm Bàn Chân & Điểm Chạm Gót Sinh Cơ Học`,videoId:`yU8C5r4N8w0`},Clavicle:{nameVi:`Xương đòn (Xương quai xanh)`,nameLatin:`Clavicula (TA2: 1098)`,nameEn:`Clavicle (Collarbone)`,regionVi:`Chi trên (Đai vai)`,systemVi:`Hệ Xương`,description:`Xương dài cong hình chữ S nằm ngang ở nền cổ và phía trước trên lồng ngực, nối từ cán xương ức ra mỏm cùng vai.`,function:`Là thanh chống cơ học giữ cho khớp vai dang rộng ra ngoài lồng ngực, giúp cánh tay cử động tự do tối đa; bảo vệ bó mạch thần kinh dưới đòn.`,clinical:`Xương dễ gãy nhất cơ thể người (thường gãy ở vị trí 1/3 ngoài tiếp giáp 2/3 trong khi ngã chống tay hoặc đập vai).`,relations:{muscles:`Cơ ngực lớn, cơ ức đòn chũm, cơ delta, cơ thang, cơ dưới đòn.`,bones:`Khớp ức - đòn ở trong và khớp cùng vai - đòn (AC Joint) ở ngoài.`,nerves:`Đám rối thần kinh cánh tay chạy ngay phía sau dưới xương đòn.`,vessels:`Động mạch dưới đòn và tĩnh mạch dưới đòn nằm ngay sau xương.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Đai Vai & Khớp Vai Linh Hoạt`,videoId:`fGjG7V3A2sQ`},Scapula:{nameVi:`Xương bả vai`,nameLatin:`Scapula (TA2: 1102)`,nameEn:`Scapula (Shoulder blade)`,regionVi:`Chi trên (Đai vai)`,systemVi:`Hệ Xương`,description:`Xương dẹt phẳng hình tam giác nằm ở mặt sau trên lồng ngực (ngang mức xương sườn 2 đến 7). Có gai vai, mỏm cùng vai, mỏm quạ và ổ chảo.`,function:`Trượt linh hoạt trên lồng ngực (khớp bả vai - lồng ngực), phối hợp nhịp nhàng với xương cánh tay tạo nên tầm vận động cực lớn của khớp vai.`,clinical:`Mất nhịp bả vai - cánh tay (Scapular dyskinesis); cánh vai nhô (Winged scapula) do liệt cơ răng trước (thần kinh ngực dài); viêm gân chóp xoay vai.`,relations:{muscles:`Nhóm cơ chóp xoay (Rotator cuff: Dưới vai, trên gai, dưới gai, tròn bé), cơ răng trước, cơ trám, cơ nâng vai.`,bones:`Khớp cùng vai đòn với xương đòn; ổ chảo (Glenoid cavity) tiếp khớp chỏm xương cánh tay.`,nerves:`Thần kinh trên vai (Suprascapular nerve), thần kinh ngực dài (Long thoracic nerve).`,vessels:`Động mạch trên vai, động mạch dưới vai.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Khớp Vai & Cân Bằng Bả Vai - Cánh Tay`,videoId:`fGjG7V3A2sQ`},Humerus:{nameVi:`Xương cánh tay`,nameLatin:`Humerus (TA2: 1118)`,nameEn:`Humerus (Arm bone)`,regionVi:`Chi trên (Cánh tay)`,systemVi:`Hệ Xương`,description:`Xương dài lớn nhất chi trên. Đầu trên có chỏm hình bán cầu, củ lớn, củ bé; thân xương hình lăng trụ có rãnh xoắn thần kinh quay; đầu dưới có lồi cầu, ròng rọc và hai mỏm trên lồi cầu.`,function:`Là đòn bẩy truyền lực cho toàn bộ chi trên, thực hiện các động tác nâng, đẩy, xoay và ném.`,clinical:`Gãy cổ phẫu thuật xương cánh tay ở người lớn tuổi; gãy thân xương cánh tay dễ tổn thương thần kinh quay gây bàn tay rủ; gãy trên lồi cầu ở trẻ em.`,relations:{muscles:`Cơ delta, cơ nhị đầu cánh tay, cơ tam đầu cánh tay, cơ cánh tay trước.`,bones:`Khớp vai ở trên (Khớp ổ chảo - cánh tay); khớp khuỷu ở dưới với xương quay và xương trụ.`,nerves:`Dây thần kinh quay (Radial nerve) chạy sát rãnh xoắn; thần kinh nách ở cổ phẫu thuật; thần kinh trụ ở rãnh sau mỏm trên lồi cầu trong.`,vessels:`Động mạch cánh tay (Brachial artery) và động mạch cánh tay sâu.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Khớp Khuỷu & Cánh Tay Khỏe Mạnh`,videoId:`fGjG7V3A2sQ`},Radius:{nameVi:`Xương quay`,nameLatin:`Radius (TA2: 1127)`,nameEn:`Radius`,regionVi:`Chi trên (Cẳng tay)`,systemVi:`Hệ Xương`,description:`Xương dài nằm ở phía ngoài cẳng tay (phía ngón tay cái). Đầu trên có đài quay khớp với xương trụ và xương cánh tay; đầu dưới to mở rộng khớp với cổ tay.`,function:`Đảm nhiệm động tác sấp và ngửa cẳng tay bằng cách quay quanh trục xương trụ; là trục truyền lực chính từ bàn tay lên cẳng tay.`,clinical:`Gãy Colles đầu dưới xương quay (biến dạng cổ tay hình dĩa) khi ngã chống bàn tay xuống đất; trật chỏm quay ở trẻ nhỏ khi bị kéo giật tay.`,relations:{muscles:`Cơ nhị đầu bám củ quay, cơ sấp tròn, cơ ngửa, cơ cánh tay quay.`,bones:`Khớp quay trụ trên và dưới với xương trụ; khớp với xương thuyền và xương nguyệt ở cổ tay.`,nerves:`Dây thần kinh quay và thần kinh giữa.`,vessels:`Động mạch quay (Radial artery - vị trí bắt mạch cổ tay quen thuộc).`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Cổ Tay & Ngón Tay Linh Hoạt`,videoId:`fGjG7V3A2sQ`},Ulna:{nameVi:`Xương trụ`,nameLatin:`Ulna (TA2: 1122)`,nameEn:`Ulna`,regionVi:`Chi trên (Cẳng tay)`,systemVi:`Hệ Xương`,description:`Xương dài nằm ở phía trong cẳng tay (phía ngón út). Đầu trên rất to có mỏm khuỷu và mỏm vẹt tạo nên khớp bản lề vững chắc với ròng rọc xương cánh tay.`,function:`Tạo trục ổn định cho động tác gấp duỗi khớp khuỷu và là điểm tựa cho xương quay thực hiện động tác sấp ngửa.`,clinical:`Vỡ mỏm khuỷu do ngã đập khuỷu tay; chèn ép dây thần kinh trụ tại rãnh khuỷu (Hội chứng đường hầm khuỷu tay) gây tê ngón út và áp út.`,relations:{muscles:`Cơ tam đầu cánh tay bám mỏm khuỷu, cơ gấp cổ tay trụ, cơ gấp sâu các ngón tay.`,bones:`Khớp với ròng rọc xương cánh tay tại khớp khuỷu; khớp với xương quay ở hai đầu.`,nerves:`Dây thần kinh trụ (Ulnar nerve) chạy ngay sau mỏm trên lồi cầu trong sát mỏm khuỷu.`,vessels:`Động mạch trụ (Ulnar artery) chạy dọc mặt trước cẳng tay.`},lessonLink:`/cot-song/tu-the-va-van-dong`,lessonTitle:`Khớp Khuỷu & Phòng Tránh Tê Bì Bàn Tay`,videoId:`fGjG7V3A2sQ`},"Frontal bone":{nameVi:`Xương trán`,nameLatin:`Os frontale (TA2: 890)`,nameEn:`Frontal bone`,regionVi:`Đầu - Mặt - Cổ`,systemVi:`Hệ Xương`,description:`Xương dẹt đơn tạo nên vòm trán, trần ổ mắt và phần trước nền sọ. Bên trong chứa xoang trán thông với ngách mũi giữa.`,function:`Bảo vệ thùy trán của đại não (trung tâm tư duy, điều hành, vận động chủ động và cảm xúc); định hình khung khuôn mặt trên.`,clinical:`Viêm xoang trán gây đau nhức âm ỉ vùng trán mắt; chấn thương nứt vỡ vòm sọ trán trong va chạm giao thông.`,relations:{muscles:`Cơ trán (Bụng trán của cơ chẩm trán), cơ cau mày, cơ vòng mắt.`,bones:`Khớp với hai xương đỉnh ở khớp vành, khớp với xương bướm, xương sàng, xương gò má và xương mũi.`,nerves:`Thần kinh trên ổ mắt và thần kinh trên ròng rọc (nhánh V1 của thần kinh sinh ba).`,vessels:`Động mạch trên ổ mắt và động mạch trên ròng rọc (nhánh của động mạch mắt).`},lessonLink:`/cot-song/dot-song-co`,lessonTitle:`Hệ Thần Kinh Trung Ương & Hộp Sọ`,videoId:`fGjG7V3A2sQ`},Mandible:{nameVi:`Xương hàm dưới`,nameLatin:`Mandibula (TA2: 953)`,nameEn:`Mandible (Lower jaw)`,regionVi:`Đầu - Mặt - Cổ`,systemVi:`Hệ Xương`,description:`Xương lớn nhất, khỏe nhất và là xương duy nhất có thể cử động được trong khối xương đầu mặt. Gồm thân hình móng ngựa và hai ngành hàm với mỏm vẹt và mỏm lồi cầu.`,function:`Mang hàm răng dưới, thực hiện các cử động nhai, nuốt, phát âm và tạo hình cằm.`,clinical:`Rối loạn khớp thái dương hàm (TMD/TMJ) gây lục cục khi há miệng và đau cơ cắn; gãy góc hàm hoặc lồi cầu hàm trong ẩu đả hoặc va chạm ngã cằm.`,relations:{muscles:`4 cơ nhai cực khỏe: Cơ cắn (Masseter), cơ thái dương (Temporalis), cơ chân bướm trong và ngoài.`,bones:`Khớp thái dương hàm (TMJ) tiếp khớp với hõm khớp của xương thái dương.`,nerves:`Dây thần kinh hàm dưới (V3) và thần kinh huyệt răng dưới chạy trong ống hàm dưới.`,vessels:`Động mạch mặt và động mạch huyệt răng dưới (nhánh động mạch hàm).`},lessonLink:`/cot-song/dot-song-co`,lessonTitle:`Khớp Thái Dương Hàm & Cơ Nhai`,videoId:`fGjG7V3A2sQ`}};function Nf(e,t){if(!e&&!t)return null;if(Mf[e])return Mf[e];if(t&&Mf[t])return Mf[t];let n=`${e} ${t||``}`.toLowerCase();for(let[e,t]of Object.entries(Mf))if(n.includes(e.toLowerCase()))return t;return Pf(e,t)}function Pf(e,t){let n=t||e||`Cấu trúc giải phẫu`,r=n.toLowerCase(),i=`Thân mình & Chi`,a=`Hệ Giải Phẫu`,o=`Cấu trúc giải phẫu ${n}, định danh trong hệ thống Terminologia Anatomica 2.`,s=`Đóng vai trò quan trọng trong việc nâng đỡ, vận động và định hình giải phẫu học cơ thể.`,c=`Cần được bảo vệ và tập luyện duy trì biên độ chuyển động tự nhiên; tránh chấn thương do sai tư thế kéo dài.`,l=`/cot-song/tu-the-va-van-dong`,u=`Kiến Thức Giải Phẫu & Vận Động Đúng`,d=`Liên kết với các bó cơ sâu và màng cơ cục bộ quanh vùng giải phẫu.`,f=`Tiếp giáp và liên kết với khung xương trục hoặc xương chi lân cận.`,p=`Được chi phối bởi các nhánh thần kinh ngoại biên tương ứng theo từng đốt tủy.`,m=`Được nuôi dưỡng bởi các nhánh động mạch và mạng lưới vi mạch cục bộ.`;return r.includes(`vertebra`)||r.includes(`spine`)||r.includes(`disc`)?(i=`Cột sống`,a=`Hệ Xương & Đĩa Đệm`,o=`Thuộc trục cột sống, cấu tạo gồm thân đốt xương xốp, cuống cung, mỏm gai và mỏm ngang.`,s=`Chịu tải trọng trục cơ thể, bảo vệ tủy gai và cho phép cử động uốn cong thân mình.`,c=`Dễ thoái hóa hoặc thoát vị đĩa đệm nếu ngồi sai tư thế hoặc mang vác vật nặng sai kỹ thuật.`,d=`Cơ dựng sống (Erector spinae), cơ nhiều chân (Multifidus), cơ liên gai.`,f=`Khớp gian thân đốt sống (đĩa đệm) và khớp liên mỏm gai.`,p=`Rễ thần kinh gai sống thoát ra từ lỗ gian đốt sống.`,m=`Các nhánh động mạch gian đốt sống và đám rối tĩnh mạch đốt sống trong/ngoài.`,l=`/cot-song/tu-the-va-van-dong`,u=`Cột Sống: Tư Thế & Vận Động Đúng`):r.includes(`muscle`)||r.includes(`cơ`)?(a=`Hệ Cơ bắp`,o=`Mô cơ vân có khả năng co rút sinh công lực, bám vào xương qua gân.`,s=`Tạo lực vận động các khớp, duy trì tư thế đứng và sinh nhiệt cho cơ thể.`,c=`Căng cơ, co thắt cơ mạn tính (Trigger points), teo cơ do bất động lâu ngày.`):(r.includes(`artery`)||r.includes(`vein`)||r.includes(`mạch`))&&(a=`Hệ Tim mạch`,o=`Ống dẫn máu có thành đàn hồi vận chuyển oxy và dưỡng chất đi nuôi mô bào.`,s=`Đảm bảo tưới máu liên tục cho các cơ quan và hồi lưu máu về tim.`,c=`Xơ vữa động mạch, huyết khối tĩnh mạch sâu, suy giãn tĩnh mạch.`),{nameVi:n,nameLatin:`${n} (Terminologia Anatomica)`,nameEn:n,regionVi:i,systemVi:a,description:o,function:s,clinical:c,relations:{muscles:d,bones:f,nerves:p,vessels:m},lessonLink:l,lessonTitle:u,videoId:`3ZfVjV7VqJ8`}}var Ff=null,If=null,Lf=!1,Rf=0,zf=null,Bf={sagittal:{nameVi:`Mặt phẳng đứng dọc (Sagittal)`,normal:new U(1,0,0),min:-.4,max:.4,step:.01,defaultVal:0},coronal:{nameVi:`Mặt phẳng đứng ngang (Coronal)`,normal:new U(0,0,1),min:-.3,max:.3,step:.01,defaultVal:0},axial:{nameVi:`Mặt phẳng nằm ngang (Axial / Transverse)`,normal:new U(0,1,0),min:0,max:1.8,step:.02,defaultVal:1}};function Vf(e){!e||!e.renderer||(e.renderer.localClippingEnabled=!0,e.renderer.clippingPlanes=[])}function Hf(e,t,n=!1,r){if(!r||!r.renderer)return;if(!e||!Bf[e]){Gf(r);return}Ff=e,Lf=n;let i=Bf[e];Rf=t===void 0?i.defaultVal:t;let a=i.normal.clone();Lf&&a.negate(),If=new P(a,Lf?Rf:-Rf),r.renderer.clippingPlanes=[If],Kf(r),r.render()}function Uf(e,t){if(!If||!Ff||!t)return;Rf=e;let n=Lf?Rf:-Rf;If.constant=n,Kf(t),t.render()}function Wf(e){return!Ff||!e||Hf(Ff,Rf,!Lf,e),Lf}function Gf(e){Ff=null,If=null,e&&e.renderer&&(e.renderer.clippingPlanes=[],zf&&e.scene&&(e.scene.remove(zf),zf.dispose(),zf=null),e.render())}function Kf(e){!If||!e||!e.scene||(zf&&=(e.scene.remove(zf),zf.dispose(),null),zf=new d(If,.8,61695),zf.material.transparent=!0,zf.material.opacity=.25,zf.material.depthWrite=!1,e.scene.add(zf))}var qf=!1,Jf=null,Yf=null,Xf=null,Zf=null,Qf=null,$f=null,ep=null,tp=null,np=new De;np.firstHitOnly=!0;var rp=new V;function ip(e,t){return qf=!qf,tp=t,qf?(pp(e),e?.canvas&&(e.canvas.style.cursor=`crosshair`),lp(e)):(pp(e),e?.canvas&&(e.canvas.style.cursor=``),up()),qf}function ap(){return qf}function op(e,t){if(!qf||!t)return!1;let n=t.canvas.getBoundingClientRect(),r=e.clientX||e.touches&&e.touches[0].clientX||0,i=e.clientY||e.touches&&e.touches[0].clientY||0;rp.x=(r-n.left)/n.width*2-1,rp.y=-((i-n.top)/n.height)*2+1,np.setFromCamera(rp,t.camera);let a=np.intersectObjects(vu(),!0).find(e=>e.object.visible);if(!a)return!1;let o=a.point.clone(),s=a.object.userData?.partId||a.object.name||`Cấu trúc 3D`;if(!Jf)Jf=o,Xf=sp(Jf,61695,t),navigator.vibrate&&navigator.vibrate(20),tp?.({status:`point1_set`,point1:Jf,part1:s});else if(Yf)pp(t),Jf=o,Xf=sp(Jf,61695,t),navigator.vibrate&&navigator.vibrate(20),tp?.({status:`point1_set`,point1:Jf,part1:s});else{Yf=o,Zf=sp(Yf,16766720,t),cp(Jf,Yf,t),navigator.vibrate&&navigator.vibrate([20,50,20]);let e=Jf.distanceTo(Yf),n=(e*100).toFixed(1),r=(e*1e3).toFixed(0);dp(`${n} cm (${r} mm)`),tp?.({status:`completed`,point1:Jf,point2:Yf,part2:s,distanceCm:n,distanceMm:r})}return t.render(),!0}function sp(e,t,n){let r=new Ne(new oe(.015,16,16),new Le({color:t,depthTest:!1,transparent:!0,opacity:.95}));return r.position.copy(e),r.renderOrder=999,n.scene.add(r),r}function cp(e,t,n){Qf&&n.scene&&(n.scene.remove(Qf),Qf.geometry.dispose(),Qf.material.dispose());let r=[e,t];Qf=new ct(new _t().setFromPoints(r),new _e({color:61695,linewidth:3,depthTest:!1,transparent:!0,opacity:.9})),Qf.renderOrder=998,n.scene.add(Qf)}function lp(e){if($f)return;let t=document.getElementById(`viewerContainer`);t&&($f=document.createElement(`div`),$f.className=`measure-badge`,$f.id=`measureBadge`,$f.style.display=`none`,t.appendChild($f),e.onFrame&&(ep=e.onFrame(()=>fp(e))))}function up(){$f&&=($f.remove(),null),ep&&=(ep(),null)}function dp(e){$f&&($f.innerHTML=`📏 <strong>${e}</strong>`,$f.style.display=`block`)}function fp(e){if(!$f||!Jf||!Yf||!e)return;let t=new U().addVectors(Jf,Yf).multiplyScalar(.5),{camera:n,canvas:r}=e,i=t.clone().project(n);if(i.z>1||i.z<-1){$f.style.display=`none`;return}let a=r.clientWidth,o=r.clientHeight,s=(i.x*.5+.5)*a,c=(-i.y*.5+.5)*o;$f.style.transform=`translate(-50%, -50%) translate3d(${s}px, ${c}px, 0)`,$f.style.display=`block`}function pp(e){Jf=null,Yf=null,e?.scene&&(Xf&&=(e.scene.remove(Xf),Xf.geometry.dispose(),Xf.material.dispose(),null),Zf&&=(e.scene.remove(Zf),Zf.geometry.dispose(),Zf.material.dispose(),null),Qf&&=(e.scene.remove(Qf),Qf.geometry.dispose(),Qf.material.dispose(),null),e.render()),$f&&($f.style.display=`none`)}var mp=[{id:`spine`,title:`Cột Sống & Đĩa Đệm`,description:`Nền tảng trục xương thân mình, cơ sinh học và phòng tránh thoát vị đĩa đệm`,items:[`Atlas`,`Axis`,`Lumbar vertebra`,`Sacrum`,`Coccyx`]},{id:`lower_limb`,title:`Chi Dưới & Khớp Gối`,description:`Trục chịu lực, khớp háng, khớp gối và chuyển động đi đứng`,items:[`Hip bone.l`,`Femur.l`,`Patella.l`,`Tibia.l`,`Fibula.l`,`Calcaneus.l`]},{id:`upper_limb`,title:`Chi Trên & Đai Vai`,description:`Sự linh hoạt đai vai, khớp khuỷu và bàn tay cầm nắm`,items:[`Clavicle.l`,`Scapula.l`,`Humerus.l`,`Radius.l`,`Ulna.l`]},{id:`thorax`,title:`Lồng Ngực & Hô Hấp`,description:`Khung bảo vệ tim phổi và cơ chế hô hấp sinh lý`,items:[`Body of sternum`,`First rib.l`]},{id:`cranium`,title:`Hộp Sọ & Đầu Mặt Cổ`,description:`Khung bảo vệ não bộ, khớp thái dương hàm và các giác quan`,items:[`Frontal bone`,`Mandible`]}],hp=null,gp=0,_p=null;function vp(e){_p||(_p=document.createElement(`div`),_p.className=`study-mode-modal hidden`,_p.id=`studyModeModal`,document.body.appendChild(_p))}function yp(e){_p||vp(e),_p.classList.remove(`hidden`),_p.innerHTML=`
    <div class="study-dialog">
      <div class="study-dialog-header">
        <div>
          <h3>📚 Chế Độ Tự Học Giải Phẫu 3D</h3>
          <p>Khám phá chuyên sâu cấu trúc, chức năng và liên quan 4 thành phần (Cơ - Xương - Thần kinh - Mạch máu)</p>
        </div>
        <button type="button" class="dialog-close-btn" id="studyClosePickerBtn">&times;</button>
      </div>

      <div class="study-modules-grid">
        ${mp.map(e=>`
          <div class="study-module-card" data-module-id="${e.id}">
            <div class="module-card-icon">🩺</div>
            <div class="module-card-body">
              <h4>${e.title}</h4>
              <p>${e.description}</p>
              <span class="module-count">${e.items.length} cấu trúc trọng tâm</span>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,document.getElementById(`studyClosePickerBtn`)?.addEventListener(`click`,()=>{Cp(e)}),_p.querySelectorAll(`.study-module-card`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.moduleId,r=mp.find(e=>e.id===n);r&&bp(r,e)})})}function bp(e,t){hp=e,gp=0,xp(t)}function xp(e){if(!hp||!_p)return;let t=hp.items[gp],n=Nf(t);sg(t,e),_p.innerHTML=`
    <div class="study-step-container">
      <!-- Step Header Bar -->
      <div class="study-step-header">
        <div class="step-module-title">
          <span>📚 ${hp.title}</span>
          <span class="step-counter">${gp+1} / ${hp.items.length}</span>
        </div>
        <button type="button" class="dialog-close-btn" id="studyExitBtn" title="Thoát chế độ học">&times;</button>
      </div>

      <!-- Flashcard Content Area -->
      <div class="study-flashcard">
        <div class="flashcard-title-row">
          <div>
            <h3>${n.nameVi}</h3>
            <span class="flashcard-latin">${n.nameLatin} (${n.nameEn||``})</span>
          </div>
          <span class="flashcard-tag">${n.systemVi}</span>
        </div>

        <!-- 4-Way Anatomical Relations -->
        <div class="flashcard-relations">
          <div class="relation-item">
            <span class="relation-icon">🔴</span>
            <div class="relation-body">
              <strong>Cơ liên quan:</strong>
              <p>${n.relations?.muscles||`Liên kết nhóm cơ định hình và vận động.`}</p>
            </div>
          </div>

          <div class="relation-item">
            <span class="relation-icon">🦴</span>
            <div class="relation-body">
              <strong>Xương & Khớp:</strong>
              <p>${n.relations?.bones||`Tiếp khớp với các diện xương kế cận.`}</p>
            </div>
          </div>

          <div class="relation-item">
            <span class="relation-icon">⚡</span>
            <div class="relation-body">
              <strong>Thần kinh:</strong>
              <p>${n.relations?.nerves||`Chi phối bởi các nhánh thần kinh ngoại biên.`}</p>
            </div>
          </div>

          <div class="relation-item">
            <span class="relation-icon">🩸</span>
            <div class="relation-body">
              <strong>Mạch máu:</strong>
              <p>${n.relations?.vessels||`Cấp máu bởi các nhánh động mạch khu vực.`}</p>
            </div>
          </div>
        </div>

        <!-- Clinical Takeaway -->
        <div class="flashcard-clinical">
          <strong>🩺 Ý nghĩa lâm sàng & Bệnh lý:</strong>
          <p>${n.clinical}</p>
        </div>

        <!-- Direct Actions -->
        <div class="flashcard-actions">
          ${n.lessonLink?`<button type="button" class="btn-study-lesson" id="studyLessonBtn">📖 Học bài: ${n.lessonTitle}</button>`:``}
          ${n.videoId?`<button type="button" class="btn-study-video" id="studyVideoBtn">▶️ Xem video bài giảng</button>`:``}
          <button type="button" class="btn-study-quiz" id="studyQuickQuizBtn">🎯 Thử thách chạm 3D</button>
        </div>
      </div>

      <!-- Bottom Step Navigation -->
      <div class="study-step-footer">
        <button type="button" class="step-nav-btn prev" id="studyPrevBtn" ${gp===0?`disabled`:``}>
          ◀ Trước
        </button>
        <button type="button" class="step-nav-btn next" id="studyNextBtn">
          ${gp===hp.items.length-1?`Hoàn thành 🎉`:`Tiếp theo ▶`}
        </button>
      </div>
    </div>
  `,document.getElementById(`studyExitBtn`)?.addEventListener(`click`,()=>Cp(e)),document.getElementById(`studyPrevBtn`)?.addEventListener(`click`,()=>{gp>0&&(gp--,xp(e))}),document.getElementById(`studyNextBtn`)?.addEventListener(`click`,()=>{gp<hp.items.length-1?(gp++,xp(e)):Sp(e)}),document.getElementById(`studyLessonBtn`)?.addEventListener(`click`,()=>{Pm(n.lessonLink,n.lessonTitle)}),document.getElementById(`studyVideoBtn`)?.addEventListener(`click`,()=>{Fm(n.videoId,n.nameVi)}),document.getElementById(`studyQuickQuizBtn`)?.addEventListener(`click`,()=>{Cp(e),_h(e)})}function Sp(e){_p.innerHTML=`
    <div class="study-dialog text-center">
      <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
      <h3>Chúc Mừng Bạn Đã Hoàn Thành!</h3>
      <p style="color: #8b949e; margin-bottom: 20px;">Bạn vừa nghiên cứu chi tiết ${hp.items.length} cấu trúc trong chuyên đề <strong>${hp.title}</strong>.</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button type="button" class="step-nav-btn next" id="studyFinishQuizBtn">🎯 Làm bài kiểm tra 3D ngay</button>
        <button type="button" class="step-nav-btn prev" id="studyFinishCloseBtn">Đóng</button>
      </div>
    </div>
  `,document.getElementById(`studyFinishQuizBtn`)?.addEventListener(`click`,()=>{Cp(e),_h(e)}),document.getElementById(`studyFinishCloseBtn`)?.addEventListener(`click`,()=>{Cp(e)})}function Cp(e){hp=null,gp=0,_p&&(_p.classList.add(`hidden`),_p.innerHTML=``),Qh()}var wp=`qbiz_anatomy_notes`;function Tp(){try{let e=localStorage.getItem(wp);return e?JSON.parse(e):{}}catch(e){return console.warn(`[notes] Failed to read from localStorage:`,e),{}}}function Ep(e){try{localStorage.setItem(wp,JSON.stringify(e)),window.dispatchEvent(new CustomEvent(`anatomy-notes-updated`,{detail:e}))}catch(e){console.warn(`[notes] Failed to write to localStorage:`,e)}}function Dp(e){return e&&Tp()[e]?.text||``}function Op(e,t,n={}){if(!e)return;let r=Tp(),i=(t||``).trim();return i?r[e]={partId:e,text:i,nameVi:n.nameVi||e,nameLatin:n.nameLatin||``,system:n.system||`skeletal`,updatedAt:new Date().toISOString()}:delete r[e],Ep(r),r[e]}function kp(e){if(!e)return;let t=Tp();delete t[e],Ep(t)}function Ap(){let e=Tp();return Object.values(e).sort((e,t)=>new Date(t.updatedAt)-new Date(e.updatedAt))}var jp=`anatomy_weak_structures`,Mp=`anatomy_learning_stats`,Np=[{id:`spine`,title:`Cột Sống & Đĩa Đệm`,description:`Nền tảng trục xương thân mình, cơ sinh học và phòng ngừa thoái hóa`,icon:`🦴`,system:`skeletal`,keyParts:[`Atlas`,`Axis`,`Lumbar vertebra I`,`Sacrum`,`Coccyx`]},{id:`lower_limb`,title:`Khung Chậu & Chi Dưới`,description:`Trục chịu tải, khớp háng, khớp gối và chuyển động đi đứng`,icon:`🦵`,system:`skeletal`,keyParts:[`Hip bone.l`,`Femur.l`,`Patella.l`,`Tibia.l`,`Fibula.l`,`Calcaneus.l`]},{id:`upper_limb`,title:`Đai Vai & Chi Trên`,description:`Sự linh hoạt đai vai, khớp khuỷu và bàn tay cầm nắm khéo léo`,icon:`💪`,system:`skeletal`,keyParts:[`Clavicle.l`,`Scapula.l`,`Humerus.l`,`Radius.l`,`Ulna.l`]},{id:`thorax`,title:`Lồng Ngực & Hô Hấp`,description:`Khung bảo vệ tạng ngực, xương sườn và cơ chế giãn nở hô hấp`,icon:`🫁`,system:`visceral`,keyParts:[`Body of sternum`,`First rib.l`]},{id:`cranium`,title:`Hộp Sọ & Đầu Mặt Cổ`,description:`Bảo vệ hệ thần kinh trung ương, xương hàm và các giác quan`,icon:`🧠`,system:`skeletal`,keyParts:[`Frontal bone`,`Mandible`]},{id:`muscular`,title:`Hệ Cơ Bắp & Vận Động`,description:`Các nhóm cơ tư thế, cơ vận động chi và cân bằng cơ thể`,icon:`⚡`,system:`muscular`,keyParts:[`Deltoid.l`,`Biceps brachii.l`,`Quadriceps femoris.l`,`Gastrocnemius.l`]},{id:`nervous`,title:`Hệ Thần Kinh & Cảm Giác`,description:`Đường truyền cảm giác, phản xạ vận động và các đám rối thần kinh`,icon:`💡`,system:`nervous`,keyParts:[`Spinal cord`,`Sciatic nerve.l`,`Femoral nerve.l`,`Vagus nerve`]}];function Pp(){try{let e=localStorage.getItem(Mp),t={totalQuestions:0,correctQuestions:0,streakDays:1,lastActiveDate:new Date().toISOString().slice(0,10),masteredParts:[],viewedParts:[]};if(!e)return t;let n=JSON.parse(e);return{...t,...n}}catch{return{totalQuestions:0,correctQuestions:0,streakDays:1,lastActiveDate:new Date().toISOString().slice(0,10),masteredParts:[],viewedParts:[]}}}function Fp(e){try{localStorage.setItem(Mp,JSON.stringify(e)),window.dispatchEvent(new CustomEvent(`anatomy-stats-updated`,{detail:e}))}catch(e){console.warn(`[Roadmap] Failed to save stats:`,e)}}function Ip(e){if(!e)return;let t=Pp();t.viewedParts.includes(e)||(t.viewedParts.push(e),Fp(t))}function Lp(){try{let e=localStorage.getItem(jp);return e?JSON.parse(e):[]}catch{return[]}}function Rp(e,t,n){if(!e)return;let r=Lp(),i=r.find(n=>n.partId===e||n.title===t);i?(i.mistakeCount=(i.mistakeCount||1)+1,i.masteryScore=Math.max(0,(i.masteryScore||50)-20),i.lastAttempt=Date.now()):r.push({partId:e,title:t||e,hint:n||``,mistakeCount:1,masteryScore:20,firstMistake:Date.now(),lastAttempt:Date.now()}),r.sort((e,t)=>t.mistakeCount-e.mistakeCount);try{localStorage.setItem(jp,JSON.stringify(r)),window.dispatchEvent(new CustomEvent(`anatomy-weak-points-updated`,{detail:r}))}catch(e){console.warn(`[Roadmap] Failed to save weak points:`,e)}let a=Pp();a.totalQuestions++,Fp(a)}function zp(e){if(!e)return;let t=Lp(),n=t.find(t=>t.partId===e);n&&(n.masteryScore=Math.min(100,(n.masteryScore||0)+30),n.lastAttempt=Date.now(),n.masteryScore>=85&&(n.mastered=!0),localStorage.setItem(jp,JSON.stringify(t)),window.dispatchEvent(new CustomEvent(`anatomy-weak-points-updated`,{detail:t})));let r=Pp();r.totalQuestions++,r.correctQuestions++,r.masteredParts.includes(e)||r.masteredParts.push(e),Fp(r)}function Bp(e){let t=Lp().filter(t=>t.partId!==e);localStorage.setItem(jp,JSON.stringify(t)),window.dispatchEvent(new CustomEvent(`anatomy-weak-points-updated`,{detail:t}))}function Vp(){let e=Pp(),t=Lp(),n=Np.reduce((e,t)=>e+t.keyParts.length,0),r=Np.map(t=>{let n=t.keyParts.filter(t=>e.masteredParts.includes(t)).length,r=t.keyParts.filter(t=>e.viewedParts.includes(t)).length,i=Math.round(n/t.keyParts.length*100),a=`not_started`;return i>=80?a=`mastered`:(r>0||n>0)&&(a=`in_progress`),{...t,masteredCount:n,totalCount:t.keyParts.length,percentage:i,status:a}}),i=e.masteredParts.length;return{overallPercentage:Math.min(100,Math.round(i/n*100)),modules:r,totalMastered:i,weakCount:t.filter(e=>!e.mastered).length,accuracyRate:e.totalQuestions>0?Math.round(e.correctQuestions/e.totalQuestions*100):0,streakDays:e.streakDays}}var Hp=`modulepreload`,Up=function(e){return`/3d/`+e},Wp={},Gp=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Up(t,n),t=s(t),t in Wp)return;Wp[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Hp,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Kp={"cơ delta":{id:`Deltoid.l`,base:`Deltoid`,system:`muscular`,nameVi:`Cơ delta (Cơ vai)`},"co delta":{id:`Deltoid.l`,base:`Deltoid`,system:`muscular`,nameVi:`Cơ delta (Cơ vai)`},"cơ nhị đầu":{id:`Biceps brachii.l`,base:`Biceps brachii`,system:`muscular`,nameVi:`Cơ nhị đầu cánh tay (Chuột trước)`},"chuột tay":{id:`Biceps brachii.l`,base:`Biceps brachii`,system:`muscular`,nameVi:`Cơ nhị đầu cánh tay`},"cơ tam đầu":{id:`Triceps brachii.l`,base:`Triceps brachii`,system:`muscular`,nameVi:`Cơ tam đầu cánh tay (Chuột sau)`},"cơ tứ đầu đùi":{id:`Quadriceps femoris.l`,base:`Quadriceps femoris`,system:`muscular`,nameVi:`Cơ tứ đầu đùi`},"cơ tứ đầu":{id:`Quadriceps femoris.l`,base:`Quadriceps femoris`,system:`muscular`,nameVi:`Cơ tứ đầu đùi`},"cơ mông lớn":{id:`Gluteus maximus.l`,base:`Gluteus maximus`,system:`muscular`,nameVi:`Cơ mông lớn`},"cơ mông":{id:`Gluteus maximus.l`,base:`Gluteus maximus`,system:`muscular`,nameVi:`Cơ mông lớn`},"cơ thang":{id:`Trapezius.l`,base:`Trapezius`,system:`muscular`,nameVi:`Cơ thang (Cơ cổ vai lưng)`},"cơ lưng rộng":{id:`Latissimus dorsi.l`,base:`Latissimus dorsi`,system:`muscular`,nameVi:`Cơ lưng rộng`},"cơ ức đòn chũm":{id:`Sternocleidomastoid.l`,base:`Sternocleidomastoid`,system:`muscular`,nameVi:`Cơ ức đòn chũm`},"cơ bắp chân":{id:`Gastrocnemius.l`,base:`Gastrocnemius`,system:`muscular`,nameVi:`Cơ bụng chân (Bắp chân)`},"thần kinh tọa":{id:`Sciatic nerve.l`,base:`Sciatic nerve`,system:`nervous`,nameVi:`Dây thần kinh tọa (Dây thần kinh ngồi)`},"thần kinh hông to":{id:`Sciatic nerve.l`,base:`Sciatic nerve`,system:`nervous`,nameVi:`Dây thần kinh tọa`},"thần kinh đùi":{id:`Femoral nerve.l`,base:`Femoral nerve`,system:`nervous`,nameVi:`Dây thần kinh đùi`},"tủy sống":{id:`Spinal cord`,base:`Spinal cord`,system:`nervous`,nameVi:`Tủy sống`},"xương đùi":{id:`Femur.l`,base:`Femur`,system:`skeletal`,nameVi:`Xương đùi`},"xương chậu":{id:`Hip bone.l`,base:`Hip bone`,system:`skeletal`,nameVi:`Xương chậu (Xương hông)`},"xương hông":{id:`Hip bone.l`,base:`Hip bone`,system:`skeletal`,nameVi:`Xương chậu`},"xương bánh chè":{id:`Patella.l`,base:`Patella`,system:`skeletal`,nameVi:`Xương bánh chè`},"khớp gối":{id:`Patella.l`,base:`Patella`,system:`skeletal`,nameVi:`Khớp gối & Xương bánh chè`},"xương chày":{id:`Tibia.l`,base:`Tibia`,system:`skeletal`,nameVi:`Xương chày`},"xương mác":{id:`Fibula.l`,base:`Fibula`,system:`skeletal`,nameVi:`Xương mác`},"xương gót":{id:`Calcaneus.l`,base:`Calcaneus`,system:`skeletal`,nameVi:`Xương gót chân`},"cột sống":{id:`Lumbar vertebra I`,base:`Vertebra`,system:`skeletal`,nameVi:`Cột sống`},"đốt sống cổ c1":{id:`Atlas`,base:`Atlas`,system:`skeletal`,nameVi:`Đốt sống cổ C1 (Đốt đội - Atlas)`},"đốt đội":{id:`Atlas`,base:`Atlas`,system:`skeletal`,nameVi:`Đốt sống cổ C1 (Đốt đội)`},atlas:{id:`Atlas`,base:`Atlas`,system:`skeletal`,nameVi:`Đốt sống cổ C1 (Atlas)`},"đốt sống cổ c2":{id:`Axis`,base:`Axis`,system:`skeletal`,nameVi:`Đốt sống cổ C2 (Đốt trục - Axis)`},"đốt trục":{id:`Axis`,base:`Axis`,system:`skeletal`,nameVi:`Đốt sống cổ C2 (Đốt trục)`},axis:{id:`Axis`,base:`Axis`,system:`skeletal`,nameVi:`Đốt sống cổ C2 (Axis)`},"đốt sống thắt lưng":{id:`Lumbar vertebra I`,base:`Lumbar vertebra`,system:`skeletal`,nameVi:`Đốt sống thắt lưng`},"xương cùng":{id:`Sacrum`,base:`Sacrum`,system:`skeletal`,nameVi:`Xương cùng (Sacrum)`},"xương cụt":{id:`Coccyx`,base:`Coccyx`,system:`skeletal`,nameVi:`Xương cụt (Coccyx)`},"xương đòn":{id:`Clavicle.l`,base:`Clavicle`,system:`skeletal`,nameVi:`Xương đòn (Quai xanh)`},"quai xanh":{id:`Clavicle.l`,base:`Clavicle`,system:`skeletal`,nameVi:`Xương đòn (Quai xanh)`},"xương bả vai":{id:`Scapula.l`,base:`Scapula`,system:`skeletal`,nameVi:`Xương bả vai`},"xương cánh tay":{id:`Humerus.l`,base:`Humerus`,system:`skeletal`,nameVi:`Xương cánh tay`},"xương quay":{id:`Radius.l`,base:`Radius`,system:`skeletal`,nameVi:`Xương quay cẳng tay`},"xương trụ":{id:`Ulna.l`,base:`Ulna`,system:`skeletal`,nameVi:`Xương trụ cẳng tay`},"xương sọ":{id:`Frontal bone`,base:`Frontal bone`,system:`skeletal`,nameVi:`Hộp sọ (Xương trán)`},"xương trán":{id:`Frontal bone`,base:`Frontal bone`,system:`skeletal`,nameVi:`Xương trán`},"xương hàm dưới":{id:`Mandible`,base:`Mandible`,system:`skeletal`,nameVi:`Xương hàm dưới`},"xương ức":{id:`Body of sternum`,base:`Body of sternum`,system:`skeletal`,nameVi:`Xương ức`},"xương sườn":{id:`First rib.l`,base:`First rib`,system:`skeletal`,nameVi:`Xương sườn`}};function qp(e,t=null){let n=e.toLowerCase().trim();if(n.includes(`so sánh`)||n.includes(`hai bên`)||n.includes(`trái phải`)||n.includes(`trái - phải`)||n.includes(`đối xứng`))return{intent:`COMPARE_BILATERAL`,target:Jp(n,t),rawQuery:e};if(n.includes(`ẩn cơ`)||n.includes(`tắt cơ`)||n.includes(`xem thần kinh`)||n.includes(`bật thần kinh`)||n.includes(`bật mạch máu`)||n.includes(`chỉ xem xương`)||n.includes(`ẩn xương`)){let t=[],r=[];return n.includes(`cơ`)&&(n.includes(`ẩn`)||n.includes(`tắt`)?t.push(`muscular`):(n.includes(`bật`)||n.includes(`xem`))&&r.push(`muscular`)),n.includes(`thần kinh`)&&r.push(`nervous`),(n.includes(`mạch máu`)||n.includes(`tim mạch`))&&r.push(`cardiovascular`),n.includes(`chỉ xem xương`)&&(r.push(`skeletal`),t.push(`muscular`,`visceral`,`joints`)),{intent:`SYSTEM_CONTROL`,hideSystems:t,showSystems:r,rawQuery:e}}if(n.startsWith(`chỉ `)||n.startsWith(`tìm `)||n.startsWith(`xem `)||n.startsWith(`cho xem `)||n.startsWith(`cho tôi xem `)||n.startsWith(`ở đâu`)||n.includes(`ở vị trí nào`)||n.startsWith(`focus `)||n.startsWith(`chỉ vào `)){let r=Jp(n,t);if(r)return{intent:`FOCUS_STRUCTURE`,target:r,rawQuery:e}}if(n.includes(`cô lập`)||n.includes(`isolate`)||n.includes(`chỉ giữ lại`))return{intent:`ISOLATE_STRUCTURE`,target:Jp(n,t)||t,rawQuery:e};if(n.includes(`bóc tách`)||n.includes(`mổ`)||n.includes(`ẩn cấu trúc`)||n.includes(`ẩn đi`))return{intent:`DISSECT_PART`,target:t,rawQuery:e};if(n.includes(`mặt cắt`)||n.includes(`cắt dọc`)||n.includes(`cắt ngang`)||n.includes(`sagittal`)||n.includes(`axial`)){let t=`sagittal`;return(n.includes(`ngang`)||n.includes(`axial`))&&(t=`axial`),(n.includes(`đứng ngang`)||n.includes(`coronal`))&&(t=`coronal`),{intent:`CLIPPING_CONTROL`,plane:t,rawQuery:e}}if(n.includes(`thước đo`)||n.includes(`đo kích thước`)||n.includes(`đo khoảng cách`)||n.includes(`kích thước bao nhiêu`))return{intent:`MEASURE_CONTROL`,rawQuery:e};if(n.includes(`ôn lại`)||n.includes(`cấu trúc hay sai`)||n.includes(`câu sai`)||n.includes(`điểm yếu`)||n.includes(`quiz thích ứng`)||n.includes(`kiểm tra lại`))return{intent:`ADAPTIVE_QUIZ`,rawQuery:e};if(n.includes(`chuyển động`)||n.includes(`giải phẫu động`)||n.includes(`tim đập`)||n.includes(`nhịp tim`)||n.includes(`hô hấp`)||n.includes(`thở`)||n.includes(`gập gối`)||n.includes(`khớp gối`)||n.includes(`khớp khuỷu`)||n.includes(`gập khuỷu`)||n.includes(`cúi ngửa`)||n.includes(`cột sống`)&&n.includes(`cúi`)||n.includes(`dạng háng`)){let t=`cardiac`;return(n.includes(`hô hấp`)||n.includes(`thở`)||n.includes(`phổi`))&&(t=`respiratory`),(n.includes(`khuỷu`)||n.includes(`biceps`)||n.includes(`nhị đầu`))&&(t=`elbow_flexion`),(n.includes(`gối`)||n.includes(`patella`)||n.includes(`bánh chè`))&&(t=`knee_flexion`),(n.includes(`cột sống`)||n.includes(`cúi`))&&(t=`spine_flexion`),(n.includes(`háng`)||n.includes(`dạng`))&&(t=`hip_abduction`),{intent:`DYNAMIC_MOTION`,motionType:t,rawQuery:e}}return n.includes(`ar`)||n.includes(`thực tế tăng cường`)||n.includes(`không gian thật`)||n.includes(`đặt vào phòng`)||n.includes(`mở camera`)?{intent:`AR_CONTROL`,rawQuery:e}:n.includes(`lộ trình`)||n.includes(`tiến độ`)||n.includes(`tiến bộ`)||n.includes(`thống kê học tập`)?{intent:`VIEW_ROADMAP`,rawQuery:e}:{intent:`CLINICAL_QNA`,target:Jp(n,t)||t,rawQuery:e}}function Jp(e,t){let n=e.toLowerCase();for(let[e,t]of Object.entries(Kp))if(n.includes(e))return t;if(t)return{id:t.id,base:t.info?.baseName||t.id,system:t.system,nameVi:t.displayName};let r=Xd(e);if(r.length>0){let e=r[0];return{id:e.sides[0]?.id||e.baseName,base:e.baseName,system:e.system,nameVi:e.name?.vi||e.baseName}}return null}async function Yp(e,t){let{intent:n,target:r,rawQuery:i,hideSystems:a,showSystems:o,plane:s}=e;if(n===`FOCUS_STRUCTURE`&&r){if(t){let e=r.system;e&&!Y.loadedSystems.includes(e)?Su(e,t).then(()=>{Gu(e),sg(r.id,t)}).catch(t=>console.warn(`Failed background load of`,e,t)):(e&&Gu(e),sg(r.id,t))}let e=Nf(r.id,r.base);return{action:`FOCUS`,actionBadge:`🎯 AI đã định vị & làm nổi bật: ${r.nameVi}`,speechText:`Đã tìm thấy ${r.nameVi}.`,message:`
        **${e.nameVi}** *(Latin: ${e.nameLatin||``})*
        - **Hệ cơ quan:** ${e.systemVi}
        - **Chức năng chính:** ${e.function}
        - **Liên quan lâm sàng:** ${e.clinical}
      `.trim(),data:e,partId:r.id}}if(n===`SYSTEM_CONTROL`){let e=[];return a?.length&&a.forEach(t=>{Wu(t),e.push(`Ẩn ${Xp(t)}`)}),o?.length&&o.forEach(n=>{t&&!Y.loadedSystems.includes(n)?Su(n,t).then(()=>Gu(n)).catch(()=>{}):Gu(n),e.push(`Bật ${Xp(n)}`)}),t?.render(),{action:`SYSTEM_VISIBILITY`,actionBadge:`👁️ AI đã điều chỉnh: ${e.join(`, `)}`,message:`
        Đã điều chỉnh các lớp giải phẫu theo yêu cầu:
        ${e.map(e=>`- ✅ **${e}**`).join(`
`)}
        
        *💡 Mẹo y khoa:* Khi ẩn các khối cơ nông, bạn có thể quan sát rõ đường đi của các bó mạch thần kinh sâu bên dưới và diện tiếp khớp giữa các xương.
      `.trim()}}if(n===`COMPARE_BILATERAL`){let e=r||{id:`Femur.l`,base:`Femur`,nameVi:`Xương đùi`,system:`skeletal`},n=e.base+`.l`,i=e.base+`.r`;if(t){let r=e.system||`skeletal`;Y.loadedSystems.includes(r)?(Gu(r),$u(n,61695,.9),$u(i,16766720,.9),sg(n,t),t?.render()):Su(r,t).then(()=>{Gu(r),$u(n,61695,.9),$u(i,16766720,.9),sg(n,t),t?.render()}).catch(()=>{})}$u(n,61695,.9),$u(i,16766720,.9),t?.render();let a=Nf(n,e.base);return{action:`COMPARE_BILATERAL`,actionBadge:`⚖️ AI đang so sánh hai bên: ${a.nameVi} (Trái 🔵 & Phải 🟡)`,message:`
        ### ⚖️ So Sánh Giải Phẫu Đối Xứng: ${a.nameVi}
        - **Đặc điểm hình thái:** Cấu trúc đối xứng gương qua mặt phẳng đứng dọc giữa (*Mid-sagittal plane*).
        - **Cơ chế chịu lực & Động học:** Hai bên phối hợp đồng vận để phân bổ tải trọng cơ thể đều 50/50 qua khung chậu xuống hai chân khi đứng thẳng.
        - **Ý nghĩa lâm sàng sai lệch:**
          - Sự bất đối xứng chiều dài (>0.5 - 1.0 cm) gây lệch vẹo xương chậu và vẹo cột sống phản ứng (*Compensatory scoliosis*).
          - Lệch tải trọng dẫn đến mòn sụn không đều ở một bên khớp (*Unilateral osteoarthritis*).
        - **Liên quan thần kinh:** Chi phối đối xứng bởi các rễ thần kinh tương ứng ở hai bên tủy sống.
      `.trim(),partId:n}}if(n===`CLIPPING_CONTROL`){Hf(s||`sagittal`,t);let e=s===`sagittal`?`Đứng dọc (Sagittal)`:s===`coronal`?`Đứng ngang (Coronal)`:`Ngang (Axial)`;return{action:`CLIPPING`,actionBadge:`🔪 AI đã kích hoạt Mặt cắt 3D: ${e}`,message:`Đã kích hoạt mặt phẳng cắt **${e}**. Bạn có thể dùng thanh trượt để di chuyển mặt cắt đi xuyên qua các lớp giải phẫu bên trong cơ thể.`}}if(n===`MEASURE_CONTROL`)return ip(t),{action:`MEASURE`,actionBadge:`📏 AI đã bật Thước đo 3D Caliper`,message:`Đã mở thước đo kích thước 3D thực tế. Hãy chạm 2 điểm bất kỳ trên mô hình để tính khoảng cách giải phẫu theo cm và mm.`};if(n===`ADAPTIVE_QUIZ`){let e=Lp();return{action:`TRIGGER_ADAPTIVE_QUIZ`,actionBadge:`🎯 AI sẵn sàng mở bài kiểm tra thích ứng`,message:e.length>0?`Hệ thống ghi nhận bạn đang có **${e.length} cấu trúc cần củng cố** (như *${e.slice(0,3).map(e=>e.title).join(`, `)}*). Nhấn nút bên dưới để bắt đầu bài thi thích ứng tập trung đúng điểm yếu!`:`Hiện tại bạn chưa có câu sai nào được ghi nhận. Hệ thống sẽ tạo bài kiểm tra tổng hợp 5 câu ngẫu nhiên để thử thách năng lực!`}}if(n===`VIEW_ROADMAP`){let e=Vp();return{action:`OPEN_ROADMAP`,actionBadge:`📊 Lộ trình học: Hoàn thành ${e.overallPercentage}%`,message:`
        ### 📊 Tiến Trình Học Tập Của Bạn
        - **Tiến độ tổng thể:** **${e.overallPercentage}%**
        - **Cấu trúc đã thành thạo:** ${e.totalMastered} cấu trúc
        - **Tỷ lệ trả lời chính xác:** ${e.accuracyRate}%
        - **Chuỗi học liên tục:** ${e.streakDays} ngày 🔥
        - **Điểm yếu cần ôn:** ${e.weakCount} cấu trúc
      `.trim()}}if(n===`DYNAMIC_MOTION`){Gp(async()=>{let{openMotionPanel:e}=await import(`./motionPanel-ccF49xnn.js`);return{openMotionPanel:e}},__vite__mapDeps([0,1])).then(({openMotionPanel:n})=>{n(t,e.motionType)}).catch(e=>console.error(`Failed to load motion panel:`,e));let n={cardiac:`🫀 Nhịp Tim & Chu kỳ Tim`,respiratory:`🫁 Cơ Chế Hô Hấp`,elbow_flexion:`💪 Gập Duỗi Khớp Khuỷu`,knee_flexion:`🦵 Gập Duỗi Khớp Gối`,spine_flexion:`🦴 Cúi Ngửa Cột Sống`,hip_abduction:`🤸 Dạng Khép Khớp Háng`}[e.motionType]||`Mô phỏng chuyển động sinh lý`;return{action:`DYNAMIC_MOTION`,actionBadge:`🎬 AI đã mở mô phỏng: ${n}`,message:`
        ### 🎬 ${n}
        Đã kích hoạt mô phỏng giải phẫu động 3D theo cơ chế sinh lý thực tế:
        - Sử dụng thanh trượt **Timeline** để tua tới từng góc độ hoặc thì chuyển động.
        - Điều chỉnh tốc độ **0.25x - 0.5x** để quan sát chuyển động chậm.
        - Chọn và bấm **Cô lập** để chỉ quan sát chuyển động của xương/cơ bạn quan tâm.
      `.trim()}}if(n===`AR_CONTROL`)return Gp(async()=>{let{openARModal:e}=await import(`./arModal-BMYDkXYK.js`);return{openARModal:e}},__vite__mapDeps([2,1])).then(({openARModal:e})=>{e(t)}).catch(e=>console.error(`Failed to load AR modal:`,e)),{action:`AR_CONTROL`,actionBadge:`📱 AI đã kích hoạt AR Thực tế`,message:`### 📱 Thực Tế Tăng Cường AR
        Đang khởi động chế độ AR để đưa mô hình người 3D vào phòng thực tế:
        - Hỗ trợ dò bề mặt sàn/bàn (WebXR) hoặc chiếu Camera trực tiếp.
        - Có thể chuyển đổi tỉ lệ: **Mặt bàn (1:5)** hoặc **Người thật (1:1)**.
        - Dùng 1 ngón tay xoay, 2 ngón tay chụm thu phóng và bấm **Chụp ảnh** để lưu lại.`};if(r){let e=Nf(r.id,r.base),t=e.relations||{},n=``,a=i.toLowerCase();return n=a.includes(`thần kinh`)||a.includes(`dây thần kinh`)?`
        **Chi phối Thần kinh của ${e.nameVi}:**
        ⚡ ${t.nerves||`Được chi phối bởi các nhánh thần kinh vận động và cảm giác khu vực.`}
      `.trim():a.includes(`mạch máu`)||a.includes(`máu`)||a.includes(`động mạch`)?`
        **Cấp máu & Tuần hoàn của ${e.nameVi}:**
        🩸 ${t.vessels||`Được nuôi dưỡng bởi các nhánh động mạch và mạng mạch quanh vùng.`}
      `.trim():a.includes(`cơ`)||a.includes(`bám`)?`
        **Liên quan Cơ bắp của ${e.nameVi}:**
        🔴 ${t.muscles||`Liên kết với các gân cơ phụ trách vận động và giữ vững tư thế.`}
      `.trim():a.includes(`bệnh`)||a.includes(`chấn thương`)||a.includes(`đau`)?`
        **Bệnh lý & Ý nghĩa Lâm sàng của ${e.nameVi}:**
        🩺 ${e.clinical}
      `.trim():`
### 📘 Thông Tin Học Thuật: ${e.nameVi}
*Latinh (TA2):* **${e.nameLatin||`Chưa định danh`}** | *Tiếng Anh:* **${e.nameEn||``}**

⚡ **Chức năng & Cơ sinh học:**
${e.function}

🔗 **4 Liên Quan Giải Phẫu Trọng Yếu:**
- 🔴 **Cơ liên quan:** ${t.muscles||`Gân cơ vận động chính.`}
- 🦴 **Xương & Khớp:** ${t.bones||`Tiếp khớp các diện xương kế cận.`}
- ⚡ **Thần kinh chi phối:** ${t.nerves||`Các nhánh thần kinh ngoại biên.`}
- 🩸 **Mạch máu cấp máu:** ${t.vessels||`Mạng mạch máu khu vực.`}

🩺 **Ý Nghĩa Lâm Sàng & Tổn Thương:**
${e.clinical}
      `.trim(),{action:`CLINICAL_ANSWER`,message:n,data:e,partId:r.id}}return{action:`ASSISTANT_REPLY`,message:`Xin chào! Tôi là Trợ lý AI Giải Phẫu 3D. Tôi có thể giúp bạn:
      - 🎯 **Điều khiển 3D bằng giọng lệnh:** Gõ *"chỉ cơ delta"*, *"tìm xương đùi"*, *"xương chày ở đâu"*...
      - 👁️ **Bóc tách nhiều lớp:** Gõ *"ẩn cơ để xem thần kinh"*, *"chỉ xem xương"*...
      - ⚖️ **So sánh đối xứng:** Gõ *"so sánh xương đùi trái-phải"*...
      - 📚 **Hỏi đáp giải phẫu học:** Hỏi chức năng, thần kinh, mạch máu của bất kỳ bộ phận nào đang chọn.
      - 🎯 **Ôn luyện điểm yếu:** Gõ *"ôn lại cấu trúc hay sai"* để mở quiz thích ứng.`}}function Xp(e){return{skeletal:`Hệ Xương`,muscular:`Hệ Cơ`,nervous:`Hệ Thần kinh`,cardiovascular:`Hệ Tim mạch`,visceral:`Hệ Nội tạng`,joints:`Hệ Khớp`,lymphatic:`Hệ Bạch huyết`}[e]||e}var Zp=null,Qp=[];function $p(e){let t=document.getElementById(`aiAssistantModal`);if(t){Zp=t;return}Zp=document.createElement(`div`),Zp.className=`ai-assistant-modal hidden`,Zp.id=`aiAssistantModal`,(document.getElementById(`app`)||document.body).appendChild(Zp)}function em(e,t=null){Zp||$p(e),Zp.classList.remove(`hidden`);let n=Y.selectedPart;nm(e,n?n.displayName||n.id:null),t&&rm(t,e)}function tm(){Zp&&Zp.classList.add(`hidden`)}function nm(e,t){if(!Zp)return;Zp.innerHTML=`
    <div class="ai-assistant-card animate-in">
      <!-- AI Header -->
      <div class="ai-header">
        <div class="ai-title-wrap">
          <div class="ai-avatar">🤖</div>
          <div>
            <h3 class="ai-title">Trợ Lý AI Giải Phẫu 3D</h3>
            <span class="ai-sub">Hỏi đáp chuẩn Y khoa & Điều khiển 3D bằng tiếng Việt</span>
          </div>
        </div>
        <button type="button" class="ai-close-btn" id="aiCloseBtn">&times;</button>
      </div>

      <!-- Active 3D Context Chip -->
      <div class="ai-context-bar">
        <span class="ai-context-icon">🎯</span>
        <span class="ai-context-text">
          ${t?`Ngữ cảnh: <strong>${om(t)}</strong>`:`Chưa chọn cấu trúc cụ thể (Đang ở chế độ toàn thân)`}
        </span>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="ai-chips-scroll">
        <button type="button" class="ai-chip" data-prompt="chỉ cơ delta">💪 Chỉ cơ delta</button>
        <button type="button" class="ai-chip" data-prompt="ẩn cơ để xem thần kinh">👁️ Ẩn cơ xem thần kinh</button>
        <button type="button" class="ai-chip" data-prompt="so sánh xương đùi trái–phải">⚖️ So sánh trái - phải</button>
        ${t?`<button type="button" class="ai-chip highlight" data-prompt="Cấu trúc này có 4 liên quan giải phẫu nào?">🔗 4 Liên quan của ${om(t)}</button>`:``}
        ${t?`<button type="button" class="ai-chip" data-prompt="Cấu trúc này có chức năng và cơ sinh học gì?">⚡ Chức năng ${om(t)}</button>`:``}
        <button type="button" class="ai-chip danger" data-prompt="ôn lại cấu trúc hay sai">🎯 Ôn câu hay sai</button>
        <button type="button" class="ai-chip" data-prompt="xem lộ trình học tập">📊 Xem lộ trình học</button>
      </div>

      <!-- Chat Messages Container -->
      <div class="ai-chat-messages" id="aiChatMessages">
        ${Qp.length===0?`
          <div class="ai-welcome-box">
            <span class="welcome-icon">🩺</span>
            <h4>Xin chào! Tôi có thể hỗ trợ bạn:</h4>
            <p>1. <strong>Ra lệnh 3D bằng tiếng Việt:</strong> <em>"chỉ cơ delta"</em>, <em>"ẩn cơ để xem thần kinh"</em>, <em>"so sánh xương đùi trái-phải"</em>.</p>
            <p>2. <strong>Hỏi đáp chuyên sâu:</strong> Chức năng, 4 liên quan (Cơ - Xương - Thần kinh - Mạch máu), bệnh lý lâm sàng.</p>
            <p>3. <strong>Học thông minh:</strong> Ôn lại các cấu trúc hay sai và xem lộ trình cá nhân.</p>
          </div>
        `:``}

        ${Qp.map(e=>`
          <div class="chat-msg ${e.role}">
            ${e.badge?`<div class="msg-action-badge">${e.badge}</div>`:``}
            <div class="msg-bubble">${am(e.text)}</div>
            ${e.partId?`<button type="button" class="msg-focus-btn" data-part="${e.partId}">🔍 Focus trên mô hình 3D</button>`:``}
            ${e.action===`TRIGGER_ADAPTIVE_QUIZ`?`<button type="button" class="msg-focus-btn quiz" id="btnStartAdaptiveFromChat">🎯 Bắt đầu bài thi thích ứng</button>`:``}
          </div>
        `).join(``)}
      </div>

      <!-- Chat Input Row -->
      <div class="ai-input-row">
        <input type="text" id="aiChatInput" class="ai-chat-input" placeholder="Nhập câu hỏi hoặc lệnh (VD: chỉ cơ delta, ẩn cơ...)..." autocomplete="off">
        <button type="button" id="aiSendBtn" class="ai-send-btn" aria-label="Gửi câu hỏi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>
  `,document.getElementById(`aiCloseBtn`)?.addEventListener(`click`,tm);let n=document.getElementById(`aiChatInput`);document.getElementById(`aiSendBtn`)?.addEventListener(`click`,()=>{let t=n?.value.trim();t&&(rm(t,e),n&&(n.value=``))}),n?.addEventListener(`keydown`,t=>{if(t.key===`Enter`){let t=n.value.trim();t&&(rm(t,e),n.value=``)}}),Zp.querySelectorAll(`.ai-chip`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.prompt;n&&rm(n,e)})}),Zp.querySelectorAll(`.msg-focus-btn[data-part]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.part;n&&(sg(n,e),tm())})}),document.getElementById(`btnStartAdaptiveFromChat`)?.addEventListener(`click`,()=>{tm(),vh(e)}),im()}async function rm(e,t){Qp.push({role:`user`,text:e}),nm(t,Y.selectedPart?.displayName);let n=qp(e,Y.selectedPart),r=document.getElementById(`aiChatMessages`);if(r){let e=document.createElement(`div`);e.className=`chat-msg bot thinking`,e.id=`aiThinkingBubble`,e.innerHTML=`<span class="spinner-inline"></span> Đang phân tích câu lệnh & xử lý mô hình 3D...`,r.appendChild(e),im()}try{let e=await Yp(n,t);document.getElementById(`aiThinkingBubble`)?.remove(),Qp.push({role:`bot`,text:e.message,badge:e.actionBadge,partId:e.partId,action:e.action}),nm(t,Y.selectedPart?.displayName)}catch{document.getElementById(`aiThinkingBubble`)?.remove(),Qp.push({role:`bot`,text:`Đã có lỗi nhỏ xảy ra khi phân tích mô hình 3D. Vui lòng thử lại lệnh khác!`}),nm(t,Y.selectedPart?.displayName)}}function im(){let e=document.getElementById(`aiChatMessages`);e&&(e.scrollTop=e.scrollHeight)}function am(e){return e?e.replace(/^### (.*$)/gim,`<h4 style="margin: 6px 0 4px; color: #58a6ff; font-size: 13px;">$1</h4>`).replace(/^## (.*$)/gim,`<h3 style="margin: 8px 0 4px; color: #fff; font-size: 14px;">$1</h3>`).replace(/\*\*(.*?)\*\*/gim,`<strong>$1</strong>`).replace(/\*(.*?)\*/gim,`<em>$1</em>`).replace(/^- (.*$)/gim,`<li style="margin-left: 14px; margin-bottom: 2px;">$1</li>`).replace(/\n\n/gim,`<br><br>`).replace(/\n/gim,`<br>`):``}function om(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`):``}function sm(e){let t=document.getElementById(`roadmapContent`);if(!t)return;let n=Vp(),r=Lp();t.innerHTML=`
    <!-- Top Progress Summary Card -->
    <div class="roadmap-summary-card">
      <div class="summary-progress-row">
        <div>
          <span class="summary-label">Tiến Độ Lộ Trình Toàn Diện</span>
          <h3 class="summary-pct">${n.overallPercentage}%</h3>
        </div>
        <div class="summary-stats-col">
          <div class="stat-pill">🔥 <span>${n.streakDays} ngày học</span></div>
          <div class="stat-pill">🎯 <span>Độ chính xác: ${n.accuracyRate}%</span></div>
          <div class="stat-pill">🏆 <span>${n.totalMastered} cấu trúc thành thạo</span></div>
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: ${n.overallPercentage}%;"></div>
      </div>
    </div>

    <!-- Weak Structures / Cấu trúc hay sai Section -->
    <div class="roadmap-section">
      <div class="section-header-row">
        <div>
          <h4 class="roadmap-section-title">🎯 Cấu Trúc Cần Ôn Luyện (${n.weakCount})</h4>
          <p class="roadmap-section-desc">Ghi nhận từ các câu trả lời sai hoặc quá giờ trong bài kiểm tra</p>
        </div>
        ${r.length>0?`
          <button type="button" class="btn-start-adaptive" id="btnStartAdaptiveFromTab">
            ⚡ Ôn ngay
          </button>
        `:``}
      </div>

      <div class="weak-structures-list">
        ${r.length===0?`
          <div class="empty-weak-state">
            <span class="empty-icon">🎉</span>
            <p>Tuyệt vời! Bạn chưa có điểm yếu nào cần củng cố.</p>
            <span class="hint">Hãy làm bài kiểm tra 3D để hệ thống phát hiện và gợi ý cấu trúc cần ôn.</span>
          </div>
        `:r.map(e=>`
          <div class="weak-item-card ${e.mastered?`mastered`:``}" data-part="${cm(e.partId)}">
            <div class="weak-item-info">
              <div class="weak-item-title-row">
                <span class="weak-name">${cm(e.title)}</span>
                <span class="weak-badge-score ${e.mastered?`good`:`warning`}">
                  ${e.mastered?`Đã thành thạo`:`Sai ${e.mistakeCount} lần`}
                </span>
              </div>
              ${e.hint?`<p class="weak-hint">💡 ${cm(e.hint)}</p>`:``}
            </div>
            <div class="weak-actions">
              <button type="button" class="btn-review-focus btn-weak-focus" data-part="${cm(e.partId)}">Xem 3D</button>
              <button type="button" class="btn-weak-del" data-del="${cm(e.partId)}" title="Bỏ qua">&times;</button>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>

    <!-- 7 Core Roadmap Milestones -->
    <div class="roadmap-section">
      <h4 class="roadmap-section-title">🗺️ Lộ Trình 7 Vùng Trọng Điểm</h4>
      <p class="roadmap-section-desc">Bám sát giải phẫu chức năng và chuẩn Terminologia Anatomica</p>

      <div class="roadmap-modules-list">
        ${n.modules.map(e=>`
          <div class="roadmap-mod-card ${e.status}" data-mod-id="${e.id}">
            <div class="mod-icon-wrap">${e.icon}</div>
            <div class="mod-body">
              <div class="mod-header-row">
                <h5 class="mod-title">${cm(e.title)}</h5>
                <span class="mod-pct-badge">${e.percentage}%</span>
              </div>
              <p class="mod-desc">${cm(e.description)}</p>
              <div class="mod-progress-bar">
                <div class="mod-progress-fill" style="width: ${e.percentage}%;"></div>
              </div>
              <div class="mod-footer-row">
                <span class="mod-count">${e.masteredCount}/${e.totalCount} cấu trúc trọng tâm</span>
                <button type="button" class="btn-mod-explore" data-part="${e.keyParts[0]}">Khám phá 3D ➔</button>
              </div>
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,document.getElementById(`btnStartAdaptiveFromTab`)?.addEventListener(`click`,()=>{window.innerWidth<=1024&&document.getElementById(`systemsToggle`)?.click(),vh(e)}),t.querySelectorAll(`.btn-weak-focus`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation();let r=t.dataset.part;r&&(sg(r,e),window.innerWidth<=1024&&document.getElementById(`systemsToggle`)?.click())})}),t.querySelectorAll(`.btn-weak-del`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation();let r=t.dataset.del;r&&(Bp(r),sm(e),$(`Đã xóa khỏi danh sách điểm yếu`))})}),t.querySelectorAll(`.btn-mod-explore`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation();let r=t.dataset.part;r&&(sg(r,e),window.innerWidth<=1024&&document.getElementById(`systemsToggle`)?.click())})})}function cm(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`):``}var lm={vi:{skeletal:`Hệ Xương`,muscular:`Hệ Cơ bắp`,joints:`Khớp & Dây chằng`,cardiovascular:`Hệ Tim mạch`,lymphatic:`Hệ Bạch huyết`,nervous:`Hệ Thần kinh & Giác quan`,visceral:`Hệ Nội tạng`},en:{skeletal:`Skeletal system`,muscular:`Muscular system`,joints:`Joints`,cardiovascular:`Cardiovascular system`,lymphatic:`Lymphoid organs`,nervous:`Nervous system & sense organs`,visceral:`Visceral systems`}},um={skeletal:`🦴`,muscular:`💪`,joints:`🦵`,cardiovascular:`❤️`,lymphatic:`🫧`,nervous:`🧠`,visceral:`🫁`};function dm(e,t=Y.language||`vi`){return lm[t]?.[e]||lm.vi?.[e]||lm.en?.[e]||e}function fm(){let e=document.getElementById(`systemsList`);if(!e)return;let t=Y.language||`en`;e.innerHTML=`
    <div class="preset-row">
      ${rf.map(e=>`
        <button type="button" class="preset-chip" data-preset="${e.id}">
          ${Q(e.label[t]||e.label.en)}
        </button>
      `).join(``)}
    </div>
  `+Nd.map(e=>{let n=su(e).length,r=um[e]||`🔬`,i=dm(e,t),a=qu(e).visible;return`
      <div class="system-group" data-system="${e}">
        <label class="system-group-label">
          <input type="checkbox" ${a?`checked`:``} data-system-checkbox="${e}">
          <span class="system-icon">${r}</span>
          <span class="system-name">${i}</span>
          <span class="system-count">${n}</span>
        </label>
        <div class="system-group-content" style="display: ${a?`block`:`none`};"></div>
      </div>
    `}).join(``),e.querySelectorAll(`[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=rf.find(t=>t.id===e.dataset.preset);t&&af(t)})}),Y.loadedSystems.forEach(t=>{let n=e.querySelector(`.system-group[data-system="${t}"] .system-group-content`);n&&n.children.length===0&&wm(t,n)}),e.querySelectorAll(`[data-system-checkbox]`).forEach(e=>{e.addEventListener(`change`,async e=>{let t=e.target.dataset.systemCheckbox,n=e.target.closest(`.system-group`),r=n.querySelector(`.system-group-content`);if(nf(),!e.target.checked){Wu(t),r.style.display=`none`,gm(t,r);return}_m(t),await ym(t,n),Gu(t),r.style.display=`block`,r.children.length===0&&wm(t,r)})})}async function pm(e){let t=iu(e)?.system;if(t){_m(t);let e=()=>document.querySelector(`.system-group[data-system="${t}"]`),n=Y.loadedSystems.includes(t),r=n&&!qu(t).visible;if(!n||r){n||await ym(t,e());let r=e(),i=r?.querySelector(`[data-system-checkbox]`),a=r?.querySelector(`.system-group-content`);i&&(i.checked=!0),a&&(a.style.display=`block`,a.children.length===0&&wm(t,a)),Gu(t)}}sg(e,Y.viewer)}var mm=3e4,hm=new Map;function gm(e,t){_m(e),hm.set(e,setTimeout(()=>{hm.delete(e),Au(e)&&t&&(t.innerHTML=``)},mm))}function _m(e){let t=hm.get(e);t&&(clearTimeout(t),hm.delete(e))}var vm=new Map;async function ym(e,t){if(!Y.loadedSystems.includes(e)){if(!vm.has(e)){let n=t?.querySelector(`.system-group-label`),r=n?.querySelector(`.system-count`),i=r?.textContent;n?.classList.add(`loading`);let a=zl(`loading`,t=>{!r||t.system!==e||t.loaded||(r.textContent=t.total?`${Math.round(t.loaded/1048576*10)/10}/${Math.round(t.total/1048576*10)/10} MB`:`${Math.round(t.loaded/1048576*10)/10} MB`)}),o=Su(e,Y.viewer).catch(t=>{console.error(`[sidebar] Failed to load ${e}:`,t),n?.classList.add(`failed`),r&&(r.textContent=Z(`retry`))}).finally(()=>{a?.(),n?.classList.remove(`loading`),r&&i&&!n?.classList.contains(`failed`)&&(r.textContent=i),vm.delete(e)});vm.set(e,o)}await vm.get(e)}}var bm=60,xm=new WeakMap;function Sm(e,t){let n=new Map;return su(e).forEach(e=>{let r=iu(e)||{},i=r.baseName||e,a=n.get(i);a||(a={base:i,label:(r.name?.[t]||r.name?.en||i).replace(/\s*\((sinistro|destro|left|right)\)$/i,``),parts:[],sides:{}},n.set(i,a)),a.parts.push(e),a.sides[r.side||`none`]=e}),[...n.values()]}function Cm(e){let t=e.sides.none||e.sides.right||e.sides.left,n=e.parts.some(e=>Y.partStates.get(e)?.visible!==!1),r=e.parts.some(e=>Y.partStates.get(e)?.selected===!0),i=[`left`,`right`].filter(t=>e.sides[t]).map(t=>`<button type="button" class="structure-side" data-select="${Q(e.sides[t])}" title="${Z(t===`left`?`side_left`:`side_right`)}">${Z(t===`left`?`side_left_short`:`side_right_short`)}</button>`).join(``),a=Q(e.label);return`
    <div class="structure-item ${r?`selected`:``}" role="option" tabindex="-1" aria-selected="${r}" data-part="${Q(t)}" data-parts="${Q(e.parts.join(`|`))}">
      <input type="checkbox" ${n?`checked`:``} data-part-checkbox="${Q(t)}">
      <span class="structure-name" title="${a}">${a}</span>
      <span class="structure-sides">${i}</span>
      <div class="structure-actions">
        <button class="action-btn isolate" data-action="isolate" title="${Q(Z(`isolate`))}" aria-label="${Q(Z(`isolate`))}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="action-btn hide" data-action="hide" title="${Q(Z(`hide`))}" aria-label="${Q(Z(`hide`))}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M2 2l20 20"/></svg>
        </button>
        <button class="action-btn transparent" data-action="transparent" title="${Q(Z(`transparent`))}" aria-label="${Q(Z(`transparent`))}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
        </button>
      </div>
    </div>
  `}function wm(e,t){let n=Sm(e,Y.language||`it`),r=0;t.innerHTML=``;let i=document.createElement(`div`);i.className=`structure-sentinel`;let a=()=>{let e=n.slice(r,r+bm);e.length&&(i.insertAdjacentHTML(`beforebegin`,e.map(Cm).join(``)),r+=e.length,xm.get(t)?.(),r>=n.length&&(o.disconnect(),i.remove()))},o=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&a()},{root:t.closest(`.sidebar-content`),rootMargin:`200px`});t.setAttribute(`role`,`listbox`),t.setAttribute(`aria-label`,Z(`systems`)),t.appendChild(i),a(),o.observe(i),t.addEventListener(`click`,Dm),t.addEventListener(`change`,Em);let s=df(t,{itemSelector:`.structure-item`,onActivate:e=>sg(e.dataset.part,Y.viewer)});s(),xm.set(t,s)}function Tm(e){return(e.dataset.parts||e.dataset.part||``).split(`|`).filter(Boolean)}function Em(e){let t=e.target.closest(`[data-part-checkbox]`);t&&Tm(t.closest(`.structure-item`)).forEach(e=>{t.checked?zu(e):Ru(e)})}function Dm(e){let t=e.target.closest(`.structure-item`);if(!t)return;let n=e.target.closest(`[data-select]`);if(n){e.stopPropagation(),sg(n.dataset.select,Y.viewer);return}let r=e.target.closest(`[data-action]`)?.dataset.action,i=Tm(t),a=t.dataset.part;if(r===`isolate`){e.stopPropagation(),Hu(a);return}if(r===`hide`){e.stopPropagation(),i.forEach(Ru),Qh();return}if(r===`transparent`){e.stopPropagation();let t=Om(a).opacity<1?1:.3;i.forEach(e=>Vu(e,t));return}e.target.type!==`checkbox`&&sg(a,Y.viewer)}function Om(e){let t=gu().get(e);if(!t)return{visible:!1,opacity:1};let n=Y.partStates.get(e);return{visible:t.visible&&n?.visible!==!1,opacity:n?.opacity??1}}function Q(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function km(e){Object.entries({resetBtn:()=>sd(e),frontViewBtn:()=>rd(`front`,e),sideViewBtn:()=>rd(`right`,e),backViewBtn:()=>rd(`back`,e),topViewBtn:()=>rd(`top`,e)}).forEach(([e,t])=>{let n=document.getElementById(e);n&&n.addEventListener(`click`,t)})}function Am(){Y.selectedPart&&Hu(Y.selectedPart.id)}function jm(){Y.selectedPart&&(Ru(Y.selectedPart.id),Qh())}function Mm(){if(Y.selectedPart){let e=Om(Y.selectedPart.id);Vu(Y.selectedPart.id,e.opacity<1?1:.3)}}function $(e,t=2500){let n=document.getElementById(`appToast`);n&&(n.textContent=e,n.classList.remove(`hidden`),n.classList.add(`show`),clearTimeout(n._timeout),n._timeout=setTimeout(()=>{n.classList.remove(`show`),setTimeout(()=>n.classList.add(`hidden`),300)},t))}function Nm(e){document.getElementById(`footerIsolateBtn`)?.addEventListener(`click`,Am),document.getElementById(`footerHideBtn`)?.addEventListener(`click`,jm),document.getElementById(`footerTransparentBtn`)?.addEventListener(`click`,Mm),document.getElementById(`footerShowAllBtn`)?.addEventListener(`click`,()=>{Uu(),Qh()}),document.getElementById(`cardBookmarkBtn`)?.addEventListener(`click`,()=>{if(!Y.selectedPart)return;let e=Y.selectedPart.id,t=Y.selectedPart.info||{},n=_f(e,{nameVi:Y.selectedPart.displayName,nameLatin:t.latinName,system:Y.selectedPart.system});Rm(e),$(n?`Đã lưu cấu trúc này vào mục Đã lưu ⭐`:`Đã xóa khỏi mục Đã lưu`)}),document.getElementById(`cardLessonBtn`)?.addEventListener(`click`,()=>{if(!Y.selectedPart)return;let e=Y.selectedPart.info||{},t=Nf(Y.selectedPart.id,e.baseName);t?.lessonLink?Pm(t.lessonLink,t.lessonTitle):Pm(`/cot-song/tu-the-va-van-dong`,`Giải phẫu cơ thể học`)}),document.getElementById(`cardIsolateBtn`)?.addEventListener(`click`,()=>{Am(),$(`Đã cô lập bộ phận này`)}),document.getElementById(`cardHideBtn`)?.addEventListener(`click`,()=>{jm(),$(`Đã bóc tách / ẩn bộ phận`)}),document.getElementById(`cardGhostBtn`)?.addEventListener(`click`,()=>{Mm(),$(`Đã đổi độ trong suốt`)}),document.getElementById(`cardInfoBtn`)?.addEventListener(`click`,()=>{document.getElementById(`infoOpen`)?.click()}),document.getElementById(`cardAIBtn`)?.addEventListener(`click`,()=>{em(e)}),document.getElementById(`cardNoteBtn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`cardNoteBox`);if(!(!e||!Y.selectedPart)&&!e.classList.toggle(`hidden`)){let e=document.getElementById(`cardNoteInput`);e&&(e.value=Dp(Y.selectedPart.id),e.focus())}}),document.getElementById(`btnCardSaveNote`)?.addEventListener(`click`,()=>{if(!Y.selectedPart)return;let e=document.getElementById(`cardNoteInput`)?.value||``;Op(Y.selectedPart.id,e,{nameVi:Y.selectedPart.displayName,nameLatin:Y.selectedPart.info?.latinName,system:Y.selectedPart.system});let t=document.getElementById(`cardNoteSavedHint`);t&&(t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)),$(`Đã lưu ghi chú học tập 📝`)}),document.getElementById(`cardCloseBtn`)?.addEventListener(`click`,()=>{Qh(),document.getElementById(`cardNoteBox`)?.classList.add(`hidden`)}),document.getElementById(`btnNavSystems`)?.addEventListener(`click`,()=>{document.getElementById(`systemsOpen`)?.click()}),document.getElementById(`btnNavSearch`)?.addEventListener(`click`,()=>{document.getElementById(`searchOpen`)?.click()});let t=document.getElementById(`btnNavDissect`);t?.addEventListener(`click`,()=>{Y.dissectMode=!Y.dissectMode,t.classList.toggle(`dissect-active`,Y.dissectMode),Y.dissectMode?$(`Dao mổ BẬT: Chạm vào bất kỳ bộ phận nào để bóc tách`):$(`Chế độ bóc tách: TẮT`)}),document.getElementById(`btnNavUndo`)?.addEventListener(`click`,()=>{let e=cg();if(e){let t=iu(e);$(`Đã phục hồi: ${t?.name?.[Y.language]||t?.name?.vi||e}`)}else $(`Không còn thao tác nào để hoàn tác`)}),document.getElementById(`btnNavReset`)?.addEventListener(`click`,()=>{Uu(),Qh(),$(`Đã khôi phục toàn bộ giải phẫu`)})}function Pm(e,t){e&&($(`Đang mở bài học: ${t||``}`),window.parent&&window.parent!==window?window.parent.postMessage({type:`NAVIGATE_LESSON`,url:e,title:t},`*`):window.open(e,`_blank`))}function Fm(e,t){if(!e)return;let n=document.getElementById(`videoModal`),r=document.getElementById(`videoModalTitle`),i=document.getElementById(`videoFrameContainer`);!n||!i||(r&&(r.textContent=t||`Video Bài Giảng Giải Phẫu`),i.innerHTML=`
    <iframe width="100%" height="100%"
            src="https://www.youtube.com/embed/${e}?autoplay=1&rel=0"
            title="${Q(t||`Video`)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
    </iframe>
  `,n.classList.remove(`hidden`))}function Im(){let e=document.getElementById(`videoModal`),t=document.getElementById(`videoFrameContainer`);e&&e.classList.add(`hidden`),t&&(t.innerHTML=``)}function Lm(){let e=document.getElementById(`videoModalClose`),t=document.getElementById(`videoModalOverlay`);e?.addEventListener(`click`,Im),t?.addEventListener(`click`,Im),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&Im()})}function Rm(e){let t=document.getElementById(`cardBookmarkBtn`);if(!t)return;let n=gf(e);t.classList.toggle(`active`,n),t.innerHTML=n?`<svg width="18" height="18" viewBox="0 0 24 24" fill="#ffdf5d" stroke="#ffdf5d" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Đã lưu`:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Lưu`}function zm(e){let t=document.querySelectorAll(`.sidebar-tab`),n={systems:document.getElementById(`tabSystemsContent`),regions:document.getElementById(`tabRegionsContent`),roadmap:document.getElementById(`tabRoadmapContent`),bookmarks:document.getElementById(`tabBookmarksContent`),notes:document.getElementById(`tabNotesContent`),history:document.getElementById(`tabHistoryContent`)};t.forEach(r=>{r.addEventListener(`click`,()=>{let i=r.dataset.tab;t.forEach(e=>e.classList.toggle(`active`,e===r)),Object.entries(n).forEach(([e,t])=>{t&&(e===i?(t.classList.remove(`hidden`),t.classList.add(`active`)):(t.classList.add(`hidden`),t.classList.remove(`active`)))}),i===`regions`&&Vm(e),i===`roadmap`&&sm(e),i===`bookmarks`&&Hm(e),i===`notes`&&Bm(e),i===`history`&&Wm(e)})}),window.addEventListener(`anatomy-notes-updated`,()=>{document.querySelector(`.sidebar-tab[data-tab="notes"]`)?.classList.contains(`active`)&&Bm(e)});let r=()=>{document.querySelector(`.sidebar-tab[data-tab="roadmap"]`)?.classList.contains(`active`)&&sm(e)};window.addEventListener(`anatomy-weak-points-updated`,r),window.addEventListener(`anatomy-stats-updated`,r)}function Bm(e){let t=document.getElementById(`notesList`);if(!t)return;let n=Ap();if(!n||n.length===0){t.innerHTML=`
      <div style="padding: 24px 16px; text-align: center; color: #8b949e;">
        <div style="font-size: 32px; margin-bottom: 8px;">📝</div>
        <p style="font-weight: 600; color: #c9d1d9; font-size: 13px;">Chưa có ghi chú nào</p>
        <p style="font-size: 11px; margin-top: 4px;">Hãy chọn cấu trúc bất kỳ trên mô hình 3D và viết ghi chú học tập.</p>
      </div>
    `;return}t.innerHTML=n.map(e=>`
    <div class="note-card-item" data-part="${Q(e.partId)}">
      <div class="note-card-header">
        <span class="note-card-title">${Q(e.nameVi||e.partId)}</span>
        <span class="note-card-date">${new Date(e.updatedAt).toLocaleDateString(`vi-VN`)}</span>
      </div>
      <p class="note-card-text">${Q(e.text)}</p>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
        <button type="button" class="btn-review-focus btn-note-goto" data-part="${Q(e.partId)}">Xem 3D</button>
        <button type="button" class="btn-review-focus btn-note-del" data-part="${Q(e.partId)}" style="color: #f85149; border-color: rgba(248,81,73,0.3);">Xóa</button>
      </div>
    </div>
  `).join(``),t.querySelectorAll(`.btn-note-goto`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),sg(t.dataset.part,e)})}),t.querySelectorAll(`.btn-note-del`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),kp(t.dataset.part),Bm(e),$(`Đã xóa ghi chú`)})}),t.querySelectorAll(`.note-card-item`).forEach(t=>{t.addEventListener(`click`,()=>{sg(t.dataset.part,e)})})}function Vm(e){let t=document.getElementById(`regionsList`);t&&(t.innerHTML=ff.map(e=>`
    <div class="region-card" data-region-id="${e.id}">
      <span class="region-icon">${e.icon}</span>
      <div class="region-info">
        <h4 class="region-title">${Q(e.labelVi)}</h4>
        <span class="region-sub">${Q(e.labelEn)}</span>
      </div>
      <button class="region-go-btn" aria-label="Đến vùng ${e.labelVi}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  `).join(``),t.querySelectorAll(`.region-card`).forEach(t=>{t.addEventListener(`click`,()=>{let n=ff.find(e=>e.id===t.dataset.regionId);n&&e&&(ld(n.camera,e),$(`Chuyển đến: ${n.labelVi}`),window.innerWidth<=1024&&document.getElementById(`systemsToggle`)?.click())})}))}function Hm(e){let t=document.getElementById(`bookmarksList`);if(!t)return;let n=hf();if(n.length===0){t.innerHTML=`
      <div class="list-empty-state">
        <span class="empty-icon">⭐</span>
        <p>Chưa có cấu trúc nào được lưu</p>
        <span class="hint">Chạm vào cấu trúc 3D và nhấn nút "Lưu" để thêm vào đây</span>
      </div>
    `;return}t.innerHTML=n.map(e=>`
    <div class="bookmark-item" data-part="${Q(e.id)}">
      <div class="bookmark-info">
        <h4 class="bookmark-name">${Q(e.nameVi||e.id)}</h4>
        ${e.nameLatin?`<span class="bookmark-latin">${Q(e.nameLatin)}</span>`:``}
      </div>
      <button class="bookmark-remove-btn" data-remove="${Q(e.id)}" title="Xóa khỏi lưu trữ">&times;</button>
    </div>
  `).join(``),t.querySelectorAll(`.bookmark-item`).forEach(t=>{t.addEventListener(`click`,n=>{n.target.closest(`.bookmark-remove-btn`)||(sg(t.dataset.part,e),window.innerWidth<=1024&&document.getElementById(`systemsToggle`)?.click())})}),t.querySelectorAll(`.bookmark-remove-btn`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),_f(t.dataset.remove),Hm(e),$(`Đã xóa khỏi danh sách đã lưu`)})})}function Um(e){if(!e)return``;let t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return`Vừa xong`;if(n<60)return`${n}p trước`;let r=Math.floor(n/60);return r<24?`${r}h trước`:`${Math.floor(r/24)}d trước`}function Wm(e){let t=document.getElementById(`historyList`);if(!t)return;let n=vf();if(n.length===0){t.innerHTML=`
      <div class="list-empty-state">
        <span class="empty-icon">🕒</span>
        <p>Chưa có lịch sử quan sát</p>
        <span class="hint">Các bộ phận bạn vừa xem sẽ hiển thị tại đây</span>
      </div>
    `;return}t.innerHTML=n.slice(0,30).map(e=>`
    <div class="history-item" data-part="${Q(e.id)}">
      <div class="history-info">
        <h4 class="history-name">${Q(e.nameVi||e.id)}</h4>
        ${e.nameLatin?`<span class="history-latin">${Q(e.nameLatin)}</span>`:``}
      </div>
      <span class="history-time">${Um(e.time)}</span>
    </div>
  `).join(``),t.querySelectorAll(`.history-item`).forEach(t=>{t.addEventListener(`click`,()=>{sg(t.dataset.part,e),window.innerWidth<=1024&&document.getElementById(`systemsToggle`)?.click()})})}function Gm(e){document.getElementById(`btnToolAI`)?.addEventListener(`click`,()=>{em(e)});let t=document.getElementById(`btnToolExplode`),n=document.getElementById(`explodePopover`),r=document.getElementById(`explodeSlider`),i=document.getElementById(`explodeValue`),a=document.getElementById(`explodeCloseBtn`);t?.addEventListener(`click`,()=>{let e=n.classList.toggle(`hidden`);t.classList.toggle(`active`,!e)}),a?.addEventListener(`click`,()=>{n.classList.add(`hidden`),t?.classList.remove(`active`)}),r?.addEventListener(`input`,t=>{let n=parseInt(t.target.value,10)||0;i&&(i.textContent=`${n}%`),jf(n/100,e)});let o=document.getElementById(`btnToolLabels`);o?.addEventListener(`click`,()=>{let t=Df(e);o.classList.toggle(`active`,t),$(t?`Đã BẬT nhãn mốc giải phẫu 3D`:`Đã TẮT nhãn 3D`)});let s=document.getElementById(`btnToolClipping`),c=document.getElementById(`clippingPopover`),l=document.getElementById(`clippingCloseBtn`),u=document.querySelectorAll(`.clipping-plane-select .plane-btn`),d=document.getElementById(`clippingSlider`),f=document.getElementById(`clippingValue`),p=document.getElementById(`clipFlipBtn`),m=document.getElementById(`clipResetBtn`);s?.addEventListener(`click`,()=>{let t=c.classList.toggle(`hidden`);if(s.classList.toggle(`active`,!t),!t){let t=document.querySelector(`.clipping-plane-select .plane-btn.active`)?.dataset.plane||`sagittal`;Hf(t,e),$(`Mặt cắt ${t===`sagittal`?`Đứng dọc`:t===`coronal`?`Đứng ngang`:`Ngang`} BẬT`)}}),l?.addEventListener(`click`,()=>{c.classList.add(`hidden`),s?.classList.remove(`active`)}),u.forEach(t=>{t.addEventListener(`click`,()=>{u.forEach(e=>e.classList.toggle(`active`,e===t));let n=t.dataset.plane;Hf(n,e),d&&(d.value=0,f&&(f.textContent=`0.0 cm`)),$(`Mặt cắt: ${t.textContent.trim()}`)})}),d?.addEventListener(`input`,e=>{let t=parseFloat(e.target.value)||0;Uf(t),f&&(f.textContent=`${(t*100).toFixed(1)} cm`)}),p?.addEventListener(`click`,()=>{Wf(),$(`Đã đảo chiều mặt cắt`)}),m?.addEventListener(`click`,()=>{Gf(e),c.classList.add(`hidden`),s?.classList.remove(`active`),$(`Đã tắt mặt cắt 3D`)});let h=document.getElementById(`btnToolMeasure`),g=document.getElementById(`measurePopover`),_=document.getElementById(`measureCloseBtn`),v=document.getElementById(`measureBody`),y=document.getElementById(`measureClearBtn`),b=document.getElementById(`measureSaveNoteBtn`),x=null;h?.addEventListener(`click`,()=>{let t=ip(e,e=>{if(x=e,v)if(e.status===`point1_set`||e.state===`point1`)v.innerHTML=`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">📍</span>
            <span style="color:#58a6ff; font-weight:600; font-size:12px;">Đã chọn Điểm A. Chạm Điểm B trên mô hình 3D...</span>
          </div>
        `;else if(e.status===`completed`||e.state===`point2`){let t=typeof e.distanceCm==`number`?e.distanceCm.toFixed(1):e.distanceCm,n=typeof e.distanceMm==`number`?e.distanceMm.toFixed(0):e.distanceMm;v.innerHTML=`
          <div style="background: rgba(35,134,54,0.15); border: 1px solid rgba(46,160,67,0.4); border-radius: 8px; padding: 10px; text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: #3fb950; letter-spacing: 0.5px;">${t} cm</div>
            <div style="font-size: 11px; color: #8b949e; margin-top: 2px;">Khoảng cách 3D thực (${n} mm)</div>
          </div>
        `}else v.innerHTML=`<p class="measure-status">Chạm vào điểm thứ nhất trên mô hình 3D...</p>`});h.classList.toggle(`active`,t),g.classList.toggle(`hidden`,!t),$(t?`Thước đo 3D BẬT: Chạm 2 điểm trên cơ thể để đo`:`Đã tắt thước đo 3D`)}),_?.addEventListener(`click`,()=>{ap()&&(ip(e),h?.classList.remove(`active`)),g.classList.add(`hidden`)}),y?.addEventListener(`click`,()=>{pp(),x=null,v&&(v.innerHTML=`<p class="measure-status">Đã xóa. Chạm vào điểm thứ nhất trên mô hình 3D...</p>`)}),b?.addEventListener(`click`,()=>{if(!x||x.status!==`completed`&&x.state!==`point2`){$(`Cần đo đủ 2 điểm trước khi lưu`);return}let e=`[Đo kích thước 3D]: ${typeof x.distanceCm==`number`?x.distanceCm.toFixed(1):x.distanceCm} cm (${typeof x.distanceMm==`number`?x.distanceMm.toFixed(0):x.distanceMm} mm)`;Op(Y.selectedPart?.id||`measurement_note_`+Date.now(),e,{nameVi:Y.selectedPart?.displayName?`${Y.selectedPart.displayName} (Kích thước)`:`Số đo giải phẫu 3D`,nameLatin:Y.selectedPart?.info?.latinName,system:Y.selectedPart?.system||`skeletal`}),$(`Đã lưu số đo vào mục Ghi chú 📝`)}),document.getElementById(`btnToolStudy`)?.addEventListener(`click`,()=>{yp(e)});let S=document.getElementById(`btnToolQuiz`);S?.addEventListener(`click`,()=>{gh()?(yh(),S.classList.remove(`active`)):(_h(e),S.classList.add(`active`))}),document.getElementById(`btnToolMotion`)?.addEventListener(`click`,async()=>{let{toggleMotionPanel:t}=await Gp(async()=>{let{toggleMotionPanel:e}=await import(`./motionPanel-ccF49xnn.js`);return{toggleMotionPanel:e}},__vite__mapDeps([0,1]));t(e)}),document.getElementById(`btnToolAR`)?.addEventListener(`click`,async()=>{let{openARModal:t}=await Gp(async()=>{let{openARModal:e}=await import(`./arModal-BMYDkXYK.js`);return{openARModal:e}},__vite__mapDeps([2,1]));t(e)})}function Km(){let e=document.getElementById(`helpModal`),t=document.getElementById(`helpBtn`),n=document.getElementById(`helpClose`),r=e?.querySelector(`.modal-overlay`);if(!e)return;let i=null;function a(){e.classList.remove(`hidden`),cf(e,!1),i=uf(e.querySelector(`.modal-content`)||e,{onEscape:o,returnFocusTo:t})}function o(){e.classList.contains(`hidden`)||(e.classList.add(`hidden`),cf(e,!0),i?.(),i=null)}cf(e,!0),t?.addEventListener(`click`,a),n?.addEventListener(`click`,o),r?.addEventListener(`click`,o)}function qm(){let e=document.getElementById(`langSelect`);e&&(e.value=Y.language||`it`,e.addEventListener(`change`,e=>{Jl(e.target.value)}))}function Jm(){let e=document.getElementById(`searchInput`),t=document.getElementById(`searchResults`);if(!e||!t)return;e.addEventListener(`input`,Ym(n=>{let r=n.target.value.toLowerCase().trim();if(r.length<2){t.innerHTML=``,t.classList.remove(`show`);return}let i=Xd(r);if(i.length>0){let n=Y.language||`it`;t.innerHTML=i.map((e,t)=>{let r=[`left`,`right`].filter(t=>e.sides[t]).map(t=>`<button type="button" class="result-side" data-part="${Q(e.sides[t])}" title="${Z(t===`left`?`side_left`:`side_right`)}">${Z(t===`left`?`side_left_short`:`side_right_short`)}</button>`).join(``),i=e.sides.none||e.sides.right||e.sides.left;return`
          <div class="search-result-item${Y.loadedSystems.includes(e.system)?``:` is-pending`}" role="option" id="search-option-${t}" aria-selected="false" data-part="${Q(i)}">
            <span class="result-name">${Q(e.label)}</span>
            <span class="result-sides">${r}</span>
            <span class="result-system">${Q(dm(e.system,n))}</span>
          </div>
        `}).join(``),t.classList.add(`show`);let r=async n=>{e.value=``,t.innerHTML=``,t.classList.remove(`show`),document.querySelector(`.header`)?.classList.remove(`search-open`),document.getElementById(`searchOpen`)?.setAttribute(`aria-expanded`,`false`),e.blur(),await pm(n)};t.querySelectorAll(`.search-result-item`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`.result-side`);r(n?n.dataset.part:e.dataset.part)})})}else t.innerHTML=`<div class="search-result-item is-empty" role="option" aria-disabled="true">${Z(`no_results`)}</div>`,t.classList.add(`show`)},150)),document.addEventListener(`click`,n=>{!e.contains(n.target)&&!t.contains(n.target)&&t.classList.remove(`show`)}),e.setAttribute(`role`,`combobox`),e.setAttribute(`aria-autocomplete`,`list`),e.setAttribute(`aria-expanded`,`false`),e.setAttribute(`aria-controls`,`searchResults`),t.setAttribute(`role`,`listbox`);let n=-1;function r(){return[...t.querySelectorAll(`.search-result-item:not(.is-empty)`)]}function i(t){let i=r();i.forEach(e=>{e.classList.remove(`is-active`),e.setAttribute(`aria-selected`,`false`)}),n=i.length?(t+i.length)%i.length:-1;let a=i[n];a?(a.classList.add(`is-active`),a.setAttribute(`aria-selected`,`true`),a.scrollIntoView({block:`nearest`}),e.setAttribute(`aria-activedescendant`,a.id)):e.removeAttribute(`aria-activedescendant`)}function a(){t.classList.remove(`show`),e.setAttribute(`aria-expanded`,`false`),e.removeAttribute(`aria-activedescendant`),n=-1}new MutationObserver(()=>{e.setAttribute(`aria-expanded`,String(t.classList.contains(`show`))),n=-1}).observe(t,{childList:!0}),e.addEventListener(`keydown`,o=>{if(o.key===`Escape`){a(),e.blur();return}if(t.classList.contains(`show`)){if(o.key===`ArrowDown`)o.preventDefault(),i(n+1);else if(o.key===`ArrowUp`)o.preventDefault(),i(n-1);else if(o.key===`Enter`){let e=r(),t=e[n]||e[0];t&&(o.preventDefault(),t.click())}}})}function Ym(e,t){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}zl(`selectedPart`,Xm),zl(`language`,Zm),zl(`partStates`,Qm);function Xm(e){document.querySelectorAll(`.structure-item.selected`).forEach(e=>{e.classList.remove(`selected`)});let t=document.getElementById(`selectionCard`);if(e){Ip(e.id);let n=document.querySelector(`.structure-item[data-part="${e.id}"]`);if(n&&n.classList.add(`selected`),t){t.classList.remove(`hidden`);let n=document.getElementById(`cardTitle`),r=document.getElementById(`cardSubtitle`),i=Y.language||`vi`,a=e.info||{},o=a.name?.[i]||a.name?.vi||e.displayName;n&&(n.textContent=o);let s=dm(a.system||e.system,i);r&&(r.textContent=a.latinName?`${a.latinName} • ${s}`:s)}Rm(e.id),$m(e)}else t&&t.classList.add(`hidden`),document.getElementById(`footerBar`)?.style.setProperty(`display`,`none`)}function Zm(e){eh(e),fm(),Y.selectedPart&&sg(Y.selectedPart.id,Y.viewer)}function Qm(e){e.forEach((e,t)=>{let n=document.querySelector(`[data-part-checkbox="${t}"]`);n&&(n.checked=e.visible!==!1);let r=document.querySelector(`.structure-item[data-part="${t}"]`);r&&(r.classList.toggle(`hidden`,e.visible===!1),r.style.opacity=e.opacity<1?`0.5`:`1`)})}function $m(e){let t=document.getElementById(`footerBar`);if(!t)return;t.style.display=`flex`;let n=document.getElementById(`footerIsolateBtn`),r=document.getElementById(`footerHideBtn`),i=document.getElementById(`footerTransparentBtn`);n&&(n.disabled=!1),r&&(r.disabled=!1),i&&(i.disabled=!1);let a=Om(e.id);i&&(i.textContent=Z(a.opacity<1?`opaque`:`transparent`))}function eh(e){let t=t=>Z(t,e);document.documentElement.lang=e;let n=document.getElementById(`searchInput`);n&&(n.placeholder=t(`search_placeholder`)),[[`resetBtn`,`reset`],[`isolateBtn`,`isolate`],[`hideBtn`,`hide`],[`transparentBtn`,`transparent`],[`frontViewBtn`,`front_view`],[`sideViewBtn`,`side_view`],[`backViewBtn`,`back_view`],[`topViewBtn`,`top_view`],[`footerIsolateBtn`,`isolate`],[`footerHideBtn`,`hide`],[`footerTransparentBtn`,`transparent`],[`footerShowAllBtn`,`show_all`]].forEach(([e,n])=>{let r=document.getElementById(e);r&&(r.title=t(n),r.tagName===`BUTTON`&&!r.querySelector(`svg`)&&(r.textContent=t(n)))});let r=document.querySelector(`.sidebar-systems .sidebar-header h2`);r&&(r.textContent=t(`systems`));let i=document.querySelector(`.sidebar-info .sidebar-header h2`);i&&(i.textContent=t(`info`)),document.querySelectorAll(`[data-i18n]`).forEach(e=>{e.textContent=t(e.dataset.i18n)});let a=document.querySelector(`.depth-label`);a&&(a.textContent=t(`depth`));let o=document.getElementById(`depthSlider`);o&&o.setAttribute(`aria-label`,t(`depth`))}async function th(e){await Hd(),eh(Y.language),fm(),zm(e),km(e),Gm(e),Nm(e),Lm(),wf(e),Vf(e),Km(),$p(e),qm(),Jm(),rh(),nh(),tf()}function nh(){let e=document.getElementById(`searchOpen`),t=document.querySelector(`.header`),n=document.getElementById(`searchInput`);!e||!t||!n||(e.addEventListener(`click`,()=>{let r=t.classList.toggle(`search-open`);e.setAttribute(`aria-expanded`,String(r)),r&&n.focus()}),n.addEventListener(`keydown`,r=>{r.key===`Escape`&&(t.classList.remove(`search-open`),e.setAttribute(`aria-expanded`,`false`),n.blur())}))}function rh(){let e=document.getElementById(`app`),t=window.matchMedia(`(max-width: 1024px)`),n={systems:{el:document.getElementById(`systemsSidebar`),closed:`-100%`,flag:`systems-open`,trigger:`systemsOpen`},info:{el:document.getElementById(`infoSidebar`),closed:`100%`,flag:`info-open`,trigger:`infoOpen`}};function r(r,i,{moveFocus:a=!1}={}){let o=n[r];if(!o.el)return;e?.classList.toggle(o.flag,i),t.matches?o.el.style.transform=i?`translateX(0)`:`translateX(${o.closed})`:o.el.style.transform=``;let s=r===`systems`?t.matches&&!i:!i;cf(o.el,s);let c=document.getElementById(o.trigger);c?.setAttribute(`aria-expanded`,String(i)),a&&(i?lf(o.el):c&&c.offsetParent!==null?c.focus():document.getElementById(`threeCanvas`)?.focus())}function i(t){return e?.classList.contains(n[t].flag)}document.getElementById(`systemsOpen`)?.addEventListener(`click`,()=>r(`systems`,!i(`systems`),{moveFocus:!0})),document.getElementById(`systemsToggle`)?.addEventListener(`click`,()=>r(`systems`,!1,{moveFocus:!0})),document.getElementById(`infoOpen`)?.addEventListener(`click`,()=>r(`info`,!i(`info`),{moveFocus:!0})),document.getElementById(`infoToggle`)?.addEventListener(`click`,()=>r(`info`,!1,{moveFocus:!0})),Object.entries(n).forEach(([e,t])=>{t.el?.addEventListener(`keydown`,t=>{t.key===`Escape`&&i(e)&&r(e,!1,{moveFocus:!0})})}),t.addEventListener(`change`,()=>{r(`systems`,i(`systems`)),r(`info`,i(`info`))}),r(`systems`,!1),r(`info`,!1)}var ih=[{title:`Xương bánh chè (Patella)`,latin:`Patella (TA2: 1152)`,targetIds:[`Patella.l`,`Patella.r`],hint:`Xương vừng hình tam giác dẹt ở mặt trước khớp gối.`,category:`Chi dưới`},{title:`Xương đùi (Femur)`,latin:`Os femoris (TA2: 1133)`,targetIds:[`Femur.l`,`Femur.r`],hint:`Xương dài nhất và chịu lực khỏe nhất trong cơ thể con người.`,category:`Chi dưới`},{title:`Xương chày (Tibia)`,latin:`Tibia (TA2: 1156)`,targetIds:[`Tibia.l`,`Tibia.r`],hint:`Xương lớn chịu 85% tải trọng nằm ở phía trong cẳng chân.`,category:`Chi dưới`},{title:`Xương mác (Fibula)`,latin:`Fibula (TA2: 1172)`,targetIds:[`Fibula.l`,`Fibula.r`],hint:`Xương mảnh nằm ở phía ngoài cẳng chân, tạo nên mắt cá ngoài.`,category:`Chi dưới`},{title:`Xương gót chân (Calcaneus)`,latin:`Calcaneus (TA2: 1184)`,targetIds:[`Calcaneus.l`,`Calcaneus.r`],hint:`Xương lớn nhất cổ chân, là điểm bám của gân gót Achilles.`,category:`Bàn chân`},{title:`Đốt sống cổ C1 (Đốt đội - Atlas)`,latin:`Atlas (Vertebra cervicalis I)`,targetIds:[`Atlas`],hint:`Đốt sống cổ đầu tiên dạng vòng tròn không có thân, nâng đỡ hộp sọ.`,category:`Cột sống`},{title:`Đốt sống cổ C2 (Đốt trục - Axis)`,latin:`Axis (Vertebra cervicalis II)`,targetIds:[`Axis`],hint:`Đốt sống có mỏm răng nhô thẳng lên tạo trục xoay cho cổ.`,category:`Cột sống`},{title:`Đốt sống thắt lưng (Lumbar vertebra)`,latin:`Vertebrae lumbales (TA2: 1045)`,targetIds:[`Lumbar vertebra I`,`Lumbar vertebra II`,`Lumbar vertebra III`,`Lumbar vertebra IV`,`Lumbar vertebra V`],hint:`5 đốt sống lớn nhất chịu tải trọng chính của nửa trên cơ thể.`,category:`Cột sống`},{title:`Xương cùng (Sacrum)`,latin:`Os sacrum (TA2: 1056)`,targetIds:[`Sacrum`],hint:`Khối xương hình tam giác lớn nối giữa hai xương cánh chậu.`,category:`Cột sống`},{title:`Xương cụt (Coccyx)`,latin:`Os coccygis (TA2: 1068)`,targetIds:[`Coccyx`],hint:`Đoạn xương nhỏ ở tận cùng phía dưới của cột sống.`,category:`Cột sống`},{title:`Xương đòn (Quai xanh)`,latin:`Clavicula (TA2: 1098)`,targetIds:[`Clavicle.l`,`Clavicle.r`],hint:`Xương cong hình chữ S nằm ngang ở phía trước trên lồng ngực.`,category:`Chi trên`},{title:`Xương bả vai (Scapula)`,latin:`Scapula (TA2: 1102)`,targetIds:[`Scapula.l`,`Scapula.r`],hint:`Xương dẹt phẳng hình tam giác nằm ở mặt sau trên lồng ngực.`,category:`Chi trên`},{title:`Xương cánh tay (Humerus)`,latin:`Humerus (TA2: 1118)`,targetIds:[`Humerus.l`,`Humerus.r`],hint:`Xương dài lớn nhất chi trên, nối từ vai xuống khuỷu.`,category:`Chi trên`},{title:`Xương quay (Radius)`,latin:`Radius (TA2: 1127)`,targetIds:[`Radius.l`,`Radius.r`],hint:`Xương cẳng tay nằm phía ngoài (ngón tay cái), thực hiện sấp ngửa.`,category:`Chi trên`},{title:`Xương trụ (Ulna)`,latin:`Ulna (TA2: 1122)`,targetIds:[`Ulna.l`,`Ulna.r`],hint:`Xương cẳng tay nằm phía ngón út, có mỏm khuỷu rất to ở trên.`,category:`Chi trên`},{title:`Thân xương ức (Sternum)`,latin:`Corpus sterni (TA2: 1079)`,targetIds:[`Body of sternum`],hint:`Xương dẹt phẳng ở đường giữa ngực khớp với các sụn sườn.`,category:`Lồng ngực`},{title:`Xương trán (Frontal bone)`,latin:`Os frontale (TA2: 890)`,targetIds:[`Frontal bone`],hint:`Xương sọ bảo vệ thùy trán, tạo nên trán và trần ổ mắt.`,category:`Đầu mặt`},{title:`Xương hàm dưới (Mandible)`,latin:`Mandibula (TA2: 953)`,targetIds:[`Mandible`],hint:`Xương duy nhất cử động được trong khối đầu mặt, thực hiện động tác nhai.`,category:`Đầu mặt`},{title:`Xương chậu (Hip bone)`,latin:`Os coxae (TA2: 1111)`,targetIds:[`Hip bone.l`,`Hip bone.r`,`Ilium.l`,`Ilium.r`],hint:`Khung xương lớn nâng đỡ thân mình và tạo ổ cối tiếp khớp với xương đùi.`,category:`Khung chậu`}],ah=!1,oh=!1,sh=[],ch=0,lh=0,uh=0,dh=0,fh=[],ph=null,mh=30,hh=null;function gh(){return ah}function _h(e){ah=!0,oh=!1,lh=0,uh=0,dh=0,ch=0,fh=[],sh=[...ih].sort(()=>.5-Math.random()).slice(0,5),Ch(e),$(`🎯 Bắt đầu bài kiểm tra 3D! Chạm vào cấu trúc được yêu cầu`),navigator.vibrate&&navigator.vibrate([50])}function vh(e){let t=Lp().filter(e=>!e.mastered);if(ah=!0,oh=!0,lh=0,uh=0,dh=0,ch=0,fh=[],t.length>0){let e=t.map(e=>e.partId),n=ih.filter(t=>t.targetIds.some(t=>e.includes(t))),r=ih.filter(e=>!n.includes(e)).sort(()=>.5-Math.random());sh=[...n,...r].slice(0,5),$(`🎯 Bắt đầu Quiz Thích Ứng: Ôn ${n.length} cấu trúc bạn hay sai!`)}else sh=[...ih].sort(()=>.5-Math.random()).slice(0,5),$(`🎯 Chưa có câu sai! Bắt đầu bài kiểm tra thích ứng ngẫu nhiên`);Ch(e),navigator.vibrate&&navigator.vibrate([50,50])}function yh(){ah=!1,oh=!1,clearInterval(ph),hh&&=(hh.remove(),null),$(`Đã thoát chế độ kiểm tra`)}function bh(e){clearInterval(ph),mh=30,xh(),ph=setInterval(()=>{mh--,xh(),mh<=0&&(clearInterval(ph),Sh(e))},1e3)}function xh(){let e=document.getElementById(`quizTimerBar`),t=document.getElementById(`quizTimerText`);if(e&&t){let n=Math.max(0,mh/30*100);e.style.width=`${n}%`,t.textContent=`${mh}s`,mh<=5?(e.style.background=`#ef4444`,t.style.color=`#ef4444`):mh<=12?(e.style.background=`#f59e0b`,t.style.color=`#f59e0b`):(e.style.background=`#10b981`,t.style.color=`#10b981`)}}function Sh(e){let t=sh[ch];fh.push(t),uh=0,Rp(t.targetIds[0],t.title,t.hint),$(`⏰ Hết giờ cho câu hỏi này!`),navigator.vibrate&&navigator.vibrate([100,50,100]),t.targetIds[0]&&$u(t.targetIds[0],16729156,.9),setTimeout(()=>{ch++,Ch(e)},1800)}function Ch(e){hh||(hh=document.createElement(`div`),hh.id=`quizOverlay`,hh.className=`quiz-overlay`,document.getElementById(`viewerContainer`)?.appendChild(hh));let t=sh[ch];if(!t){Th(e);return}bh(e),hh.innerHTML=`
    <div class="quiz-card animate-in">
      <div class="quiz-card-header">
        <div class="quiz-badge">
          <span>🎯 Câu ${ch+1}/${sh.length}</span>
          ${oh?`<span class="streak-badge" style="background:#8957e5;">⚡ Thích ứng</span>`:``}
          ${uh>1?`<span class="streak-badge">🔥 x${uh}</span>`:``}
        </div>
        <div class="quiz-timer">
          <span id="quizTimerText">30s</span>
          <button class="quiz-close-btn" id="btnQuizClose" aria-label="Thoát">&times;</button>
        </div>
      </div>

      <div class="quiz-timer-track">
        <div class="quiz-timer-bar" id="quizTimerBar" style="width: 100%;"></div>
      </div>

      <div class="quiz-prompt">
        <span class="quiz-target-label">Hãy chạm vào trên mô hình 3D:</span>
        <h3 class="quiz-target-name">${t.title}</h3>
        <span class="quiz-target-latin">${t.latin}</span>
      </div>

      <div class="quiz-hint-box">
        💡 <strong>Gợi ý:</strong> ${t.hint}
      </div>

      <div class="quiz-footer-status">
        <span>Điểm hiện tại: <strong>${lh}</strong></span>
        <span class="quiz-hint-tap">Chạm trực tiếp vào xương/cơ trên màn hình</span>
      </div>
    </div>
  `,document.getElementById(`btnQuizClose`)?.addEventListener(`click`,yh)}function wh(e,t){if(!ah)return!1;clearInterval(ph);let n=sh[ch];if(!n)return!1;if(n.targetIds.some(t=>e===t||e.startsWith(t.replace(/\.(l|r)$/,``)))){uh++,uh>dh&&(dh=uh);let r=100+(uh-1)*20;lh+=r,zp(n.targetIds[0]),$u(e,1096065,1),$(`🎉 CHÍNH XÁC! +${r} điểm ${uh>1?`(Chuỗi x${uh})`:``}`),navigator.vibrate&&navigator.vibrate([30,40,60]),setTimeout(()=>{ed(e),ch++,Ch(t)},1200)}else{uh=0,fh.push(n),Rp(n.targetIds[0],n.title,n.hint);let r=iu(e),i=r?.name?.[Y.language]||r?.name?.vi||e;$u(e,15680580,.9),$(`❌ Chưa đúng! Bạn vừa chạm: "${i}"`),navigator.vibrate&&navigator.vibrate([150]),n.targetIds[0]&&$u(n.targetIds[0],16766720,.9),setTimeout(()=>{ed(e),n.targetIds[0]&&ed(n.targetIds[0]),ch++,Ch(t)},2e3)}return!0}function Th(e){clearInterval(ph);let t=sh.length,n=t-fh.length,r=Math.round(n/t*100),i=`Bác sĩ tương lai (Xuất sắc)`,a=`#10b981`,o=`🏆`;r<60?(i=`Cần rèn luyện thêm`,a=`#ef4444`,o=`📖`):r<80&&(i=`Khá - Nắm vững cơ bản`,a=`#f59e0b`,o=`🌟`),hh.innerHTML=`
    <div class="quiz-card score-card animate-in">
      <div style="font-size: 40px; margin-bottom: 6px;">${o}</div>
      <h2 style="color: ${a}; font-size: 20px; font-weight: 800; margin-bottom: 4px;">${i}</h2>
      <p style="color: #c9d1d9; font-size: 13px; margin-bottom: 12px;">Đúng <strong>${n}/${t}</strong> câu (${r}%) • Điểm số: <strong>${lh}</strong></p>

      ${fh.length>0?`
        <div class="missed-review-box">
          <span class="review-title">Cấu trúc cần ôn tập lại:</span>
          <div class="missed-list">
            ${fh.map(e=>`
              <div class="missed-item" data-part="${e.targetIds[0]}">
                <span>📍 ${e.title}</span>
                <button type="button" class="btn-review-focus" data-focus="${e.targetIds[0]}">Xem lại 3D</button>
              </div>
            `).join(``)}
          </div>
        </div>
      `:`<p style="color: #10b981; font-weight: 600; font-size: 13px; margin-bottom: 12px;">Tuyệt vời! Bạn không sai câu nào!</p>`}

      <div class="score-card-actions">
        <button type="button" class="quiz-btn primary" id="btnQuizRestart">🔄 Kiểm tra lại</button>
        <button type="button" class="quiz-btn secondary" id="btnQuizFinish">Đóng</button>
      </div>
    </div>
  `,document.getElementById(`btnQuizRestart`)?.addEventListener(`click`,()=>_h(e)),document.getElementById(`btnQuizFinish`)?.addEventListener(`click`,yh),hh.querySelectorAll(`.btn-review-focus`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.focus;n&&(yh(),sg(n,e))})})}var Eh=10,Dh=300,Oh=5,kh=new De;kh.firstHitOnly=!0;var Ah=new V,jh=null,Mh=null,Nh=null,Ph=null,Fh=null,Ih=null,Lh=!1;function Rh(e,t){Bh(e,t.canvas),kh.setFromCamera(Ah,t.camera);let n=kh.intersectObjects(vu(),!0);for(let e of n){if(!e.object.visible)continue;let t=Xh(e.object);if(t)return t}return null}function zh(e){let{canvas:t,controls:n}=e;return n?.addEventListener(`start`,()=>{Lh=!0}),n?.addEventListener(`end`,()=>{Lh=!1}),t.addEventListener(`pointerdown`,Vh),t.addEventListener(`pointercancel`,Hh),t.addEventListener(`click`,Wh),t.addEventListener(`dblclick`,Gh),t.addEventListener(`pointermove`,Kh),t.addEventListener(`touchstart`,Jh,{passive:!1}),t.addEventListener(`touchend`,Yh,{passive:!1}),()=>{t.removeEventListener(`pointerdown`,Vh),t.removeEventListener(`pointercancel`,Hh),t.removeEventListener(`click`,Wh),t.removeEventListener(`dblclick`,Gh),t.removeEventListener(`pointermove`,Kh),t.removeEventListener(`touchstart`,Jh),t.removeEventListener(`touchend`,Yh)}}function Bh(e,t){let n=t.getBoundingClientRect(),r=e.clientX||e.touches&&e.touches[0].clientX||0,i=e.clientY||e.touches&&e.touches[0].clientY||0;Ah.x=(r-n.left)/n.width*2-1,Ah.y=-((i-n.top)/n.height)*2+1}function Vh(e){if(e.button!==0){Ph=null;return}Ph={x:e.clientX,y:e.clientY,type:e.pointerType}}function Hh(){Ph=null}function Uh(e,t){return t?Math.hypot(e.clientX-t.x,e.clientY-t.y)>Oh:!1}function Wh(e){let t=Y.viewer;if(!t)return;let n=Ph;if(Ph=null,n&&n.type!==`mouse`||Uh(e,n))return;if(ap()){op(e,t);return}let r=Rh(e,t);if(r){let e=r.userData.partId;if(wh(e,t))return;if(Y.dissectMode){au(e),Ru(e),Qh(),t.render();return}Zh(e,t)}else Qh()}function Gh(e){let t=Y.viewer;if(!t)return;let n=Rh(e,t);n&&od(n,t,!0)}function Kh(e){e.pointerType&&e.pointerType!==`mouse`||Lh||(Fh={clientX:e.clientX,clientY:e.clientY},!Ih&&(Ih=requestAnimationFrame(()=>{Ih=null;let e=Fh;Fh=null,e&&qh(e)})))}function qh(e){let t=Y.viewer;if(!t)return;let n=Rh(e,t);n!==Mh&&(Mh&&Mh!==jh&&ed(Mh.userData.partId),n?(n!==jh&&$u(n.userData.partId,16768861,.3),Mh=n,t.canvas.style.cursor=`pointer`):(Mh=null,t.canvas.style.cursor=`grab`),t.render())}function Jh(e){if(e.touches.length!==1){Nh=null;return}let t=e.touches[0];Nh={x:t.clientX,y:t.clientY,time:e.timeStamp}}function Yh(e){let t=Nh;if(Nh=null,!t||e.changedTouches.length!==1)return;let n=e.changedTouches[0],r=Math.hypot(n.clientX-t.x,n.clientY-t.y),i=e.timeStamp-t.time;if(r>Eh||i>Dh)return;let a=Y.viewer;if(!a)return;let o=Rh({clientX:n.clientX,clientY:n.clientY},a);if(o){if(ap()){op({clientX:n.clientX,clientY:n.clientY},a);return}let e=o.userData.partId;if(wh(e,a))return;if(Y.dissectMode){au(e),Ru(e),Qh(),a.render();return}Zh(e,a)}else Qh()}function Xh(e){let t=e;for(;t;){if(t.userData?.partId)return t;t=t.parent}return null}function Zh(e,t){jh&&ed(jh.userData.partId);let n=gu().get(e);if(!n)return;let r=iu(e),i={id:e,meshName:n.userData.originalName||n.name,displayName:r?.name?.[Y.language]||r?.name?.en||e,system:r?.system||n.userData.system||`unknown`,region:r?.region||`unknown`,info:r};$u(e,16768861,.8),jh=n,Zu(e),wd(e,i.displayName,{isolate:e=>Hu(e),hide:e=>{Ru(e),Qh()},close:()=>Qh()}),gu().forEach((t,n)=>{let r=Y.partStates.get(n);r&&(r.selected=n===e)}),Vl(i),yf(e,{nameVi:i.displayName,nameLatin:r?.latinName,system:i.system}),navigator.vibrate&&navigator.vibrate(20),$h(i),rg()}function Qh(){jh&&=(ed(jh.userData.partId),null),Qu(),Td(),gu().forEach((e,t)=>{let n=Y.partStates.get(t);n&&(n.selected=!1)}),Vl(null),ng(),ig()}function $h(e){let t=document.querySelector(`.info-placeholder`),n=document.getElementById(`structureInfo`);t&&(t.style.display=`none`),n&&n.classList.remove(`hidden`);let r=Y.language||`en`,i=e.info||{},a=i.name?.[r]||i.name?.en||e.displayName,o=ag(i.system||e.system,r),s=i.side===`left`?`side_left`:i.side===`right`?`side_right`:null,c=Nf(e.id,i.baseName),l=``;if(c){let t=c.relations||{};l=`
      <div class="clinical-box">
        <h4 class="clinical-heading">⚡ Chức năng & Vận động</h4>
        <p class="clinical-desc">${og(c.function)}</p>

        <!-- 4-Way Anatomical Relations -->
        <h4 class="clinical-heading" style="margin-top: 12px; color: #58a6ff;">🔗 Liên Quan Giải Phẫu Học</h4>
        <div class="flashcard-relations" style="margin-top: 6px;">
          <div class="relation-item">
            <span class="relation-icon">🔴</span>
            <div class="relation-body">
              <strong>Cơ liên quan:</strong>
              <p>${og(t.muscles||`Liên kết nhóm cơ định hình và vận động.`)}</p>
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">🦴</span>
            <div class="relation-body">
              <strong>Xương & Khớp:</strong>
              <p>${og(t.bones||`Tiếp khớp với các diện xương kế cận.`)}</p>
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">⚡</span>
            <div class="relation-body">
              <strong>Thần kinh:</strong>
              <p>${og(t.nerves||`Chi phối bởi các nhánh thần kinh ngoại biên.`)}</p>
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">🩸</span>
            <div class="relation-body">
              <strong>Mạch máu:</strong>
              <p>${og(t.vessels||`Cấp máu bởi các nhánh động mạch khu vực.`)}</p>
            </div>
          </div>
        </div>

        <h4 class="clinical-heading" style="margin-top: 12px; color: #ff7b72;">🩺 Ý nghĩa lâm sàng & Bệnh lý</h4>
        <p class="clinical-desc">${og(c.clinical)}</p>

        <!-- Personal Study Note Area in Info Panel -->
        <div class="info-note-area" style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
          <label style="font-size: 11px; font-weight: 700; color: #a371f7; display: block; margin-bottom: 4px;">📝 Ghi chú cá nhân:</label>
          <textarea class="info-note-input" rows="2" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 6px; color: #fff; padding: 6px; font-size: 11px;" placeholder="Ghi chú học tập cho cấu trúc này...">${og(Dp(e.id))}</textarea>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <button type="button" class="btn-info-save-note" style="padding: 4px 10px; font-size: 11px; background: #8957e5; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Lưu ghi chú</button>
            <span class="info-note-hint" style="display: none; font-size: 10px; color: #3fb950; font-weight: 600;">✓ Đã lưu</span>
          </div>
        </div>

        <div class="clinical-actions" style="margin-top: 12px;">
          ${c.lessonLink?`<button type="button" class="btn-lesson-link" data-lesson-url="${og(c.lessonLink)}" data-lesson-title="${og(c.lessonTitle)}">📖 Học bài: ${og(c.lessonTitle)}</button>`:``}
          ${c.videoId?`<button type="button" class="btn-video-link" data-video-id="${og(c.videoId)}" data-video-title="${og(c.nameVi)}">▶️ Xem video bài giảng</button>`:``}
        </div>
      </div>
    `}n.innerHTML=`
    <div class="structure-header">
      <div class="structure-title">
        <h3>${og(a)}</h3>
        ${i.latinName?`<span class="structure-latin">${og(i.latinName)}</span>`:``}
        <div class="structure-tags">
          <span class="structure-system">${og(o)}</span>
          ${s?`<span class="structure-tag">${og(Z(s,r))}</span>`:``}
          ${i.official===!1?`<span class="structure-tag warn" title="${og(Z(`non_official_hint`,r))}">${og(Z(`non_official`,r))}</span>`:``}
        </div>
      </div>
    </div>
    ${l}
    ${eg(e.id,r)}
    <div class="structure-description" data-definition>${og(Z(`loading_definition`,r))}</div>
  `,n.querySelectorAll(`[data-relation]`).forEach(e=>{e.addEventListener(`click`,()=>sg(e.dataset.relation,Y.viewer))}),n.querySelectorAll(`.btn-lesson-link`).forEach(e=>{e.addEventListener(`click`,()=>{Pm(e.dataset.lessonUrl,e.dataset.lessonTitle)})}),n.querySelectorAll(`.btn-video-link`).forEach(e=>{e.addEventListener(`click`,()=>{Fm(e.dataset.videoId,e.dataset.videoTitle)})}),n.querySelector(`.btn-info-save-note`)?.addEventListener(`click`,()=>{let t=n.querySelector(`.info-note-input`)?.value||``;Op(e.id,t,{nameVi:a,nameLatin:i.latinName,system:i.system||e.system});let r=n.querySelector(`.info-note-hint`);r&&(r.style.display=`inline`,setTimeout(()=>{r.style.display=`none`},2e3))}),tg(e,r)}function eg(e,t){let n=_u(e);if(!n)return``;let r=e=>{let n=iu(e);return og(n?.name?.[t]||n?.name?.en||e)},i=[];return n.parentId&&i.push(`
      <div class="relation">
        <span class="relation-label">${og(Z(`part_of`,t))}</span>
        <button type="button" class="relation-link" data-relation="${og(n.parentId)}">${r(n.parentId)}</button>
      </div>
    `),n.childIds.length&&i.push(`
      <div class="relation">
        <span class="relation-label">${og(Z(`contains`,t))}</span>
        <span class="relation-links">
          ${n.childIds.slice(0,8).map(e=>`<button type="button" class="relation-link" data-relation="${og(e)}">${r(e)}</button>`).join(``)}
          ${n.childIds.length>8?`<span class="relation-more">+${n.childIds.length-8}</span>`:``}
        </span>
      </div>
    `),i.length?`<div class="structure-relations">${i.join(``)}</div>`:``}async function tg(e,t){let n=await Bd(),r=document.querySelector(`#structureInfo [data-definition]`);if(!r||Y.selectedPart?.id!==e.id)return;let i=e.info?.baseName||e.id,a=n[i];if(!a){r.classList.add(`is-empty`),r.textContent=Z(`no_definition`,t);return}r.classList.remove(`is-empty`),r.innerHTML=`
    ${og(a)}
    <a class="definition-source" href="https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(i)}"
       target="_blank" rel="noopener">${og(Z(`read_more`,t))}</a>
  `}function ng(){let e=document.querySelector(`.info-placeholder`),t=document.getElementById(`structureInfo`);e&&(e.style.display=`flex`),t&&t.classList.add(`hidden`)}function rg(){let e=document.getElementById(`footerBar`);e&&(e.style.display=`flex`)}function ig(){let e=document.getElementById(`footerBar`);e&&(e.style.display=`none`)}function ag(e,t){let n=Z(`system_${e}`,t);return n===`system_${e}`?e:n}function og(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function sg(e,t){return gu().get(e)?(Zh(e,t),!0):!1}function cg(){let e=ou();return e?(zu(e),Y.viewer?.render(),e):null}var lg=400,ug=3,dg=null,fg=!1;function pg(e){return Number(e.toFixed(ug))}function mg(){let e=new URLSearchParams;Y.loadedSystems.length&&e.set(`sys`,Y.loadedSystems.join(`,`));let t=Y.viewer;if(t){let{camera:n,controls:r}=t;e.set(`cam`,[pg(n.position.x),pg(n.position.y),pg(n.position.z),pg(r.target.x),pg(r.target.y),pg(r.target.z)].join(`,`))}Y.selectedPart?.id&&e.set(`sel`,Y.selectedPart.id),Y.isolatedPart&&e.set(`iso`,Y.isolatedPart);let n=[...Y.hiddenParts];n.length&&n.length<200&&e.set(`hid`,n.join(`|`));let r=[...Y.transparentParts];return r.length&&r.length<200&&e.set(`tra`,r.join(`|`)),Y.language&&Y.language!==`en`&&e.set(`lang`,Y.language),e.toString()}function hg(){let e=window.location.hash.replace(/^#/,``);if(!e)return null;let t=new URLSearchParams(e),n=t.get(`cam`)?.split(`,`).map(Number);return{systems:t.get(`sys`)?.split(`,`).filter(Boolean)||[],camera:n?.length===6&&n.every(Number.isFinite)?n:null,selected:t.get(`sel`)||null,isolated:t.get(`iso`)||null,hidden:t.get(`hid`)?.split(`|`).filter(Boolean)||[],transparent:t.get(`tra`)?.split(`|`).filter(Boolean)||[],language:t.get(`lang`)||null}}function gg(){if(dg=null,fg)return;let e=mg(),t=`${window.location.pathname}${window.location.search}#${e}`;window.history.replaceState(null,``,t);try{window.localStorage.setItem(`anatomy:view`,e)}catch{}}function _g(){fg||dg||(dg=setTimeout(gg,lg))}async function vg(e,{loadSystem:t,selectPart:n,setVisible:r,setTransparency:i,isolate:a}){if(!e)return!1;fg=!0;try{e.language&&Jl(e.language);for(let n of e.systems)if(!Y.loadedSystems.includes(n))try{await t(n)}catch(e){console.error(`[urlState] Failed to load ${n}:`,e)}if(e.hidden.forEach(e=>r(e,!1)),e.transparent.forEach(e=>i(e,.3)),e.camera&&Y.viewer){let{camera:t,controls:n}=Y.viewer;t.position.set(e.camera[0],e.camera[1],e.camera[2]),n.target.set(e.camera[3],e.camera[4],e.camera[5]),n.update()}return e.isolated&&a(e.isolated),e.selected&&n(e.selected),!0}finally{fg=!1}}function yg(){try{let e=window.localStorage.getItem(`anatomy:view`);if(!e)return null;let t=window.location.hash;window.location.hash=e;let n=hg();return window.history.replaceState(null,``,`${window.location.pathname}${window.location.search}${t}`),n}catch{return null}}Zl({vi:Fl,en:Ll,it:Il});function bg(e){let t=[];return Object.entries(e).forEach(([e,n])=>{let r=[e.toLowerCase()];n.name?.vi&&r.push(n.name.vi.toLowerCase()),n.name?.en&&r.push(n.name.en.toLowerCase()),n.name?.it&&r.push(n.name.it.toLowerCase()),n.baseName&&r.push(n.baseName.toLowerCase()),n.latinName&&r.push(n.latinName.toLowerCase()),Ad(n.baseName).forEach(e=>r.push(e.toLowerCase())),t.push({partId:e,name:n.name?.[Y.language]||n.name?.vi||n.name?.en||e,latinName:n.latinName||``,system:n.system||`unknown`,terms:[...new Set(r)]})}),t}var xg;try{console.log(`[main] Creating scene...`),xg=ba(),console.log(`[main] Scene created:`,!!xg),nu(xg),window.viewer=xg,xg.canvas.__viewer=xg,xg.startRenderLoop(),console.log(`[main] Render loop started`)}catch(e){console.error(`Scene creation error:`,e)}async function Sg(){console.log(`[main] init() called`);let e=document.getElementById(`loadingOverlay`);try{let[e,t]=await Promise.all([Ld(),Rd()]);Xl(e),Bd();let n=Vd(e,t);if(Yl(n),Ql(bg(n)),console.log(`[main] Anatomy data ready: ${Object.keys(n).length} structures`),xg){let e=hg()||yg(),t=e?.systems?.length?e.systems:[Pd];console.log(`[main] Loading ${t.join(`, `)}...`),await Du(t,xg),e&&await vg(e,{loadSystem:e=>Su(e,xg),selectPart:e=>sg(e,xg),setVisible:(e,t)=>t?zu(e):Ru(e),setTransparency:(e,t)=>Vu(e,t),isolate:e=>Hu(e)})}}catch(e){console.error(`[main] Initialization error:`,e)}finally{e&&(e.classList.add(`hidden`),setTimeout(()=>{e.style.display=`none`},300)),xg&&(await th(xg),zh(xg),Cg(xg)),console.log(`[main] Z-Anatomy initialization complete`)}}function Cg(e){[`selectedPart`,`partStates`,`systemShown`,`systemHidden`,`partIsolated`,`allPartsRestored`,`language`].forEach(e=>zl(e,_g)),e.controls?.addEventListener(`end`,_g)}console.log(`[main] Calling init()...`),Sg(),document.addEventListener(`visibilitychange`,()=>{xg&&(document.hidden?xg.stopRenderLoop():xg.startRenderLoop())}),window.ZAnatomy={viewer:xg,loadSystems:Du};export{Sa as a,Y as i,Su as n,yu as r,gu as t};