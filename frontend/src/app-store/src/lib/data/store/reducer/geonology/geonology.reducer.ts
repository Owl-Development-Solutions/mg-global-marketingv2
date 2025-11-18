import { GeonologyNode, GeonologyResponse } from '@app-store/public-api';
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
  data: GeonologyResponse,
): GeonologyNode => {
  if (!node) return node;

  if (node.userName.toLowerCase() === parentUserName.toLowerCase()) {
    const parentSide = node.side === 'root' ? '' : node.side;
    const newSide = `${parentSide}[${side === '[L]' ? 'L' : 'R'}]`;
    const sideChild = side === '[L]' ? 'left' : 'right';

    const updatedChild = {
      ...child,
      side: newSide,
      id: data.newUserId,
    };

    return {
      ...node,
      leftDownline:
        side === '[L]' ? (node.leftDownline || 0) + 1 : node.leftDownline || 0,
      rightDownline:
        side === '[R]'
          ? (node.rightDownline || 0) + 1
          : node.rightDownline || 0,
      [`${sideChild}Child`]: updatedChild,
    };
  }

  const updatedLeft = node.leftChild
    ? updateChildRecursive(node.leftChild, parentUserName, side, child, data)
    : node.leftChild;
  const updatedRight = node.rightChild
    ? updateChildRecursive(node.rightChild, parentUserName, side, child, data)
    : node.rightChild;

  const leftChanged = updatedLeft !== node.leftChild;
  const rightChanged = updatedRight !== node.rightChild;

  if (leftChanged || rightChanged) {
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
  }

  return node;
};

const deleteSubtreeRecursive = (
  node: GeonologyNode | null,
  userIdToDelete: string,
): GeonologyNode | null => {
  if (!node) return null;

  // This removes the node and its entire subtree from the structure.
  if (node.id === userIdToDelete) {
    return null;
  }

  // Recursively check children
  const updatedLeft = node.leftChild
    ? deleteSubtreeRecursive(node.leftChild, userIdToDelete)
    : node.leftChild;

  const updatedRight = node.rightChild
    ? deleteSubtreeRecursive(node.rightChild, userIdToDelete)
    : node.rightChild;

  // If the recursive calls resulted in no changes to the children,
  // we return the original, immutable node reference.
  if (updatedLeft === node.leftChild && updatedRight === node.rightChild) {
    return node;
  }

  // If a change occurred (a descendant was deleted), we return a new node object
  // with the updated child pointers, **ENSURING THE ANCESTOR NODE IS PRESERVED.**
  return {
    ...node,
    leftChild: updatedLeft,
    rightChild: updatedRight,
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
    (state, { parentUserName, side, child, data }) => {
      return {
        ...state,
        tree: state.tree
          ? updateChildRecursive(state.tree, parentUserName, side, child, data)
          : null,
      };
    },
  ),
  on(fromGeonology.deleteUserGenealogyAttempted, (state) => {
    return {
      ...state,
      loadingAttempted: true,
      loadingSuccess: false,
      error: null,
    };
  }),
  on(fromGeonology.deleteUserGenealogyFailed, (state, { error }) => {
    return {
      ...state,
      loadingAttempted: false,
      loadingSuccess: false,
      error: error || 'Failed to delete user and sub-tree',
    };
  }),
  on(fromGeonology.deleteUserGenealogySucceeded, (state, { userGeonology }) => {
    const userIdToDelete = userGeonology.id as string;

    const newTree = state.tree
      ? deleteSubtreeRecursive(state.tree, userIdToDelete)
      : null;

    return {
      ...state,
      loadingAttempted: false,
      tree: newTree,
    };
  }),
);
