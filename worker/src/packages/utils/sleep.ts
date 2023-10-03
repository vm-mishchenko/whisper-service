export const sleep = async (timeInSec: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, timeInSec * 1000);
    })
}
