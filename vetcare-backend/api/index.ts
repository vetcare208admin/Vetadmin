export default async (req: any, res: any) => {
    res.status(200).json({
        status: 'raw-node-ok',
        timestamp: new Date().toISOString()
    });
};
