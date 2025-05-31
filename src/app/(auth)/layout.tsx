import type { FC, ReactNode } from 'react';

type LayoutProps = { children: ReactNode };

const AuthLayout: FC<LayoutProps> = (props) => {
	return (
		<div className='min-h-screen gap-4 flex items-center justify-center'>
			{props.children}
		</div>
	)
}

export default AuthLayout;