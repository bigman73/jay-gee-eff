import { GraphMetaData } from './common'

/**
 * A single graph node.
 */
export class JGFNode {
  public label: string
  public metadata?: GraphMetaData

  /**
   * Constructor.
   *
   * @param label - Node label.
   */
  constructor(label: string) {
    // this.name = name
    this.label = label
  }
}
