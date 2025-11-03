import { Pipe, PipeTransform } from '@angular/core';
import { GeonologyNode } from '../../models/geonology.model';

@Pipe({
  name: 'genealogyFlattened',
})
export class GenealogyFlattenedPipe implements PipeTransform {
  flattenBinaryTree(root: GeonologyNode | null) {
    if (!root) {
      return [];
    }

    const flattenedUsers: Omit<GeonologyNode, 'leftChild' | 'rightChild'>[] =
      [];

    const stack = [root];

    while (stack.length > 0) {
      const currentNode = stack.pop();

      const { leftChild, rightChild, ...userWithoutChildren } =
        currentNode as GeonologyNode;

      flattenedUsers.push(userWithoutChildren);

      if (rightChild) {
        stack.push(rightChild);
      }

      if (leftChild) {
        stack.push(leftChild);
      }
    }

    return flattenedUsers;
  }

  transform(root: GeonologyNode | null) {
    return this.flattenBinaryTree(root);
  }
}
