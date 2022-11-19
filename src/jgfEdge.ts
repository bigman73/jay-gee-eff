import { GraphMetaData } from './common'

/**
 * A single graph edge.
 */
export class JGFEdge {
  public id?: string
  public relation?: string
  public label?: string
  public source: string
  public target: string
  public directed? = false
  public metadata?: GraphMetaData

  /**
   * Constructor.
   *
   * @param id - Edge id.
   * @param relation - Edge relation between the source and target nodes.
   * @param label - Edge label.
   * @param source - Source node on the edge.
   * @param target - Target node on the edge.
   */
  constructor(id: string, relation: string, label: string, source: string, target: string) {
    this.id = id
    this.relation = relation
    this.label = label
    this.source = source
    this.target = target
  }
}
