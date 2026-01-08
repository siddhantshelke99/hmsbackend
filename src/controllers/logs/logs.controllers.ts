import {logs, CommonHelper, Request, Response, ResponseObject, StatusCodes, XlsxHelper} from '../../shared/shared.module';
import { Op } from 'sequelize';
export class logsController{
    public commonHelper: CommonHelper;
    public xlsxHelper: XlsxHelper;
    constructor(){
        this.commonHelper = new CommonHelper();
        this.xlsxHelper = new XlsxHelper();
    }

    public async createLogs (logBy: string | null = null, logByName: string | null = null, logDescription: string, type: string) {
        const date = this.commonHelper.getFormattedDate();
        const time = this.commonHelper.getCurrentTime();
        const creationResult = await logs.create({logBy, logByName, logDescription, date, time, type});
        if (creationResult) return true;
        else return false;
    }

    public getLogs = async (req: Request, res: Response) => {
        try {
            const whereClause = [];
            if ((Object.keys(req.query).includes('fromDate') && req.query.date !== '') && (Object.keys(req.query).includes('toDate') && req.query.date !== '')) {
                whereClause.push({date: {[Op.between]: [req.query.fromDate, req.query.toDate]}});
            }
            if (Object.keys(req.query).includes('logBy') && req.query.logBy !== '') {
                if (req.query.logBy !== 'ALL') {
                    let users: any = req.query.logBy;
                    users = users.split(',');
                    whereClause.push({ logBy: { [Op.in]: users } });
                }
            }
            const page = isNaN(parseInt(req.query.page as string, 10)) ? 1 : parseInt(req.query.page as string, 10);
            const pageSize = isNaN(parseInt(req.query.pageSize as string, 10)) ? 10 : parseInt(req.query.pageSize as string, 10);
            const offset = (page - 1) * pageSize;

            const result = await logs.findAndCountAll({where: whereClause, raw: true, offset, limit: pageSize, order: [['date', 'DESC'],['time','DESC']]}).then(resultD => {return {success: true, data: resultD}}).catch(error => {return {success: false, message: error.message}});
            if (result.success) {
                const response: ResponseObject = {
                    response: {
                        data: result.data,
                        error: null,
                        message: null,
                        status: StatusCodes.SUCCESS
                    }
                }
                return res.status(StatusCodes.SUCCESS).json(response)
            } else {
                const response: ResponseObject = {
                    response: {
                        data: null,
                        error: result.message,
                        message: null,
                        status: StatusCodes.QUERYERROR
                    }
                }
                return res.status(StatusCodes.QUERYERROR).json(response)
            }
        } catch (error) {
            const response: ResponseObject = {
                response: {
                    data: null,
                    error,
                    message: null,
                    status: StatusCodes.SERVERERROR
                }
            }
            return res.status(StatusCodes.SERVERERROR).json(response)
        }
    }

    public downloadLogs = async (req: Request, res: Response) => {
        try {
            const whereClause = [];
            if ((Object.keys(req.query).includes('fromDate') && req.query.date !== '') && (Object.keys(req.query).includes('toDate') && req.query.date !== '')) {
                whereClause.push({date: {[Op.between]: [req.query.fromDate, req.query.toDate]}});
            }
            if (Object.keys(req.query).includes('logBy') && req.query.logBy !== '') {
                if (req.query.logBy !== 'ALL') {
                    let users: any = req.query.logBy;
                    users = users.split(',');
                    whereClause.push({ logBy: { [Op.in]: users } });
                }
            }
            const result = await logs.findAll({where: whereClause, raw: true, order: [['date', 'DESC'],['time','DESC']]}).then(resultD => {return {success: true, data: resultD}}).catch(error => {return {success: false, message: error.message}});
            const data = this.xlsxHelper.exportExcel(result.data);
            return res.download(data);
        } catch (error) {
            const response: ResponseObject = {
                response: {
                    data: null,
                    error,
                    message: null,
                    status: StatusCodes.SERVERERROR
                }
            }
            return res.status(StatusCodes.SERVERERROR).json(response)
        }
    }
    
    }