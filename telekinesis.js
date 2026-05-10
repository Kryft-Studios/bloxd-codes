onPlayerClick=(mid,_,x,y,z)=>{
    } else if (tMaxY < tMaxZ) {
      iy += stepY;
      tMaxY += tDeltaY;
    } else {
      iz += stepZ;
      tMaxZ += tDeltaZ;
    }

    const stop = callback(ix, iy, iz, i);
    if (stop === true) break;
  }
}
function voxelLineEnd(dir, pos, blocks, maxDistance = 100,precise) {
  let last = precise?pos:[Math.floor(pos[0]), Math.floor(pos[1]), Math.floor(pos[2])];

  iterateOverVoxelLine(dir, pos, maxDistance, (x, y, z) => {
    last = [x, y, z];

    if (blocks(x, y, z)) {
      return true; // stop early on hit
    }
    return false;
  },precise);

  return last;
}
