import toPath from 'lodash.topath';
import * as r from 'ramda';
import paths from './paths';

const edgeToTransformation = ([fRawPath, depRawPaths]) => {
  const fPath = toPath(fRawPath);
  const depPaths = r.map(toPath, depRawPaths);
  const fLens = r.lensPath(fPath);
  
  return (graph) => {
    return r.over(fLens, (f) => {
      return r.partial(f, paths(depPaths, graph));
    }, graph);
  };
};

const mapEdgesToTransformations = r.map(edgeToTransformation);

export default (edges, graph) => {
  const transformations = mapEdgesToTransformations(edges);

  return r.pipe.apply(null, transformations)(graph);
};
