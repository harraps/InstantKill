let Util = {
    
    // necessary for mouse look
    TAU : Math.PI*2,
    PI  : Math.PI,
    hPI : Math.PI*0.5,
    
    // conversion functions
    getCannonVec( vec : Sup.Math.Vector3 ) : CANNON.Vec3 {
        return new CANNON.Vec3(vec.x,vec.y,vec.z);
    },
    getSupVec( vec : CANNON.Vec3 ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(vec.x,vec.y,vec.z);
    },
    getCannonQuat( quat : Sup.Math.Quaternion ) : CANNON.Quaternion {
        return new CANNON.Quaternion(quat.x,quat.y,quat.z,quat.w);
    },
    getSupQuat( quat : CANNON.Quaternion ) : Sup.Math.Quaternion {
        return new Sup.Math.Quaternion(quat.x,quat.y,quat.z,quat.w);
    },
    
    // orientation functions
    getLeft( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
            1 - 2*( q.y*q.z - q.z*q.z ),
                2*( q.x*q.y + q.z*q.w ),
                2*( q.x*q.z - q.y*q.w )
        );
    },
    getUp( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
                2*( q.x*q.y - q.z*q.w ),
            1 - 2*( q.x*q.x - q.z*q.z ),
                2*( q.y*q.z + q.x*q.w )
        );
    },
    getForward( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
                2*( q.x*q.z + q.w*q.y ),
                2*( q.y*q.x - q.w*q.x ),
            1 - 2*( q.x*q.x + q.y*q.y )
        );
    },
};