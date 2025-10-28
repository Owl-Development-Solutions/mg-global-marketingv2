import { GeonologyNode } from '@app-store/public-api';
import { GeonolyResult } from '../../../mock/geonology-test-results';
import { createReducer, on } from '@ngrx/store';
import * as fromGeonology from '../../actions/geonology/geonology-actions';

export const geonologyKey = 'geonology';

export interface GeonologyState {
  tree: GeonologyNode | null;
  loadingAttempted: boolean;
  loadingSuccess: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialReducerState: GeonologyState = {
  tree: GeonolyResult,
  loading: false,
  loaded: false,
  loadingAttempted: false,
  loadingSuccess: false,
  error: null,
};

const updateChildRecursive = (
  node: GeonologyNode,
  parentUserName: string,
  side: string,
  child: GeonologyNode,
): GeonologyNode => {
  if (!node) return node;

  if (node.userName.toLowerCase() === parentUserName.toLowerCase()) {
    const parentSide = node.side === 'root' ? '' : node.side;
    const newSide = `${parentSide}[${side === '[L]' ? 'L' : 'R'}]`;
    const sideChild = side === '[L]' ? 'left' : 'right';

    return {
      ...node,
      leftDownline:
        side === 'left' ? (node.leftDownline || 0) + 1 : node.leftDownline || 0,
      rightDownline:
        side === 'right'
          ? (node.rightDownline || 0) + 1
          : node.rightDownline || 0,
      [`${sideChild}Child`]: {
        ...child,
        side: newSide,
      },
    };
  }

  const updatedLeft = node.leftChild
    ? updateChildRecursive(node.leftChild, parentUserName, side, child)
    : node.leftChild;
  const updatedRight = node.rightChild
    ? updateChildRecursive(node.rightChild, parentUserName, side, child)
    : node.rightChild;

  const leftChanged = updatedLeft !== node.leftChild;
  const rightChanged = updatedRight !== node.rightChild;

  return {
    ...node,
    leftChild: updatedLeft,
    rightChild: updatedRight,
    leftDownline: leftChanged
      ? (node.leftDownline || 0) + 1
      : node.leftDownline || 0,
    rightDownline: rightChanged
      ? (node.rightDownline || 0) + 1
      : node.rightDownline || 0,
  };
};

export const initiateGeonologyReducer = createReducer(
  initialReducerState,
  on(fromGeonology.getGenealogyAttempted, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(fromGeonology.getGenealogyFailed, (state, { error }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error,
    };
  }),
  on(fromGeonology.getGenealogySucceeded, (state, { data }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error: null,
      tree: data,
    };
  }),
  on(fromGeonology.addUserGeonologyAttempted, (state) => {
    return {
      ...state,
      loadingAttempted: true,
      loadingSuccess: false,
      error: null,
    };
  }),
  on(fromGeonology.addUserGeonologyFailed, (state, { error }) => {
    return {
      ...state,
      loaded: false,
      loading: false,
      error: error || 'Failed to add user',
    };
  }),
  on(
    fromGeonology.addUserGeonologySucceded,
    (state, { parentUserName, side, child }) => {
      return {
        ...state,
        tree: state.tree
          ? updateChildRecursive(state.tree, parentUserName, side, child)
          : null,
      };
    },
  ),
);
