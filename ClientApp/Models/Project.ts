export interface Taxonomy {
    id?: number;
    name: string;
    caption: string;
    parent?: Taxonomy;
    children?: Taxonomy[];
    order?: number;
}
