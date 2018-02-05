import * as r from 'ramda';
import paths from './paths';
import invariant from 'invariant';

const toPath = r.pipe(
  r.split(/[^\w\d]+/g),
  r.reject(r.isEmpty),
);

const edgeToTransformation = ([fRawPath, depRawPaths]) => {
  const fPath = toPath(fRawPath);
  const depPaths = r.map(toPath, depRawPaths);
  const fLens = r.lensPath(fPath);

  return (graph) => {
    // Start of debug
    if(process.env.NODE_ENV !== 'production') {
      // Util functions we will need but only in non-prod
      const isPopulated = r.complement(r.isEmpty);
      const isDependencyInGraph = (depPath, graph) => {
        return r.pipe(
          r.init,
          (x) => r.path(x)(graph),
          r.has(r.last(depPath)),
        )(depPath);
      };

      // Check that the key exists for the func
      invariant(
        typeof r.view(fLens)(graph) === 'function',
        `Function [${fRawPath}] not found in graph`
      );

      // Check that the dep exists
      // It is important to note that a dep could be
      // null or undefined. Therefore we need to check the key
      // not the value
      r.forEachObjIndexed((depPath, idx) => {
        invariant(
          isPopulated(depPath),
          `Empty path at index [${idx}] for [${fRawPath}]`
        );

        invariant(
          isDependencyInGraph(depPath, graph),
          `Dependency [${depRawPaths[idx]}] for [${fRawPath}] not found in graph`
        );
      })(depPaths);

    }
    // End of debug
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
