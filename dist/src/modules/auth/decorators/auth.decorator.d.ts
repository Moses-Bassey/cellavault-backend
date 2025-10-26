import { UserType } from '../../../enums/user-type.enum';
export declare const Auth: (roles?: UserType[]) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
