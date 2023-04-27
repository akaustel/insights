export interface InsightOptions {
    filters: {
        master: string;
        columns: {};
    };
    pivot: {
        visible: true;
        calculation: {
            formula: 'count' | 'avg';
            column: null;
        };
        rows: number[];
        cols: [];
        sort: {};
    };
    table: {
        visible: boolean;
        paging: number;
        sort: {
            col: number;
            order: boolean;
        };
        drilldown: '';
    };
}
/**
 * Insight with performance and simplicity
 *
 * @author Juha Järvinen <jj@bitools.fi>
 */
export declare function Insight(div: string, data: any, options: InsightOptions): void;
