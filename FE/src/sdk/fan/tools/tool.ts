export interface FanTool {

    /**
     * Tool Name
     */
    name: string;

    /**
     * Description
     */
    description: string;

    /**
     * Execute
     */
    execute(
        args?: Record<string, any>,
    ): Promise<any>;

}