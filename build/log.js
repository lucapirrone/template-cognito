Object.defineProperty(exports, "__esModule", { value: true });
exports.log = require("winston");
exports.log.configure({
    transports: [
        new exports.log.transports.Console({
            timestamp: true,
            level: process.env['LOG_LEVEL'],
        }),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQXVDO0FBRXZDLFdBQUcsQ0FBQyxTQUFTLENBQUM7SUFDWixVQUFVLEVBQUU7UUFDVixJQUFJLFdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQ3pCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1NBQ2hDLENBQUM7S0FDSDtDQUNGLENBQUMsQ0FBQyJ9